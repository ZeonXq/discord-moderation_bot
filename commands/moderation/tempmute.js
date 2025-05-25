const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config/config.json');
const ms = require('ms');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempmute')
    .setDescription('Temporarily mutes a user by assigning the muted role.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to mute temporarily').setRequired(true))
    .addStringOption(option =>
      option.setName('duration').setDescription('Mute duration (e.g. 1h, 30m, 2d)').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for tempmute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    const mutedRole = interaction.guild.roles.cache.get(config.mutedRoleId);

    if (!member) {
      return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    }

    if (!mutedRole) {
      return interaction.reply({ content: 'Muted role not found. Check your config file.', ephemeral: true });
    }

    if (member.roles.cache.has(mutedRole.id)) {
      return interaction.reply({ content: 'This user is already muted.', ephemeral: true });
    }

    const durationMs = ms(duration);
    if (!durationMs || durationMs < 1000) {
      return interaction.reply({ content: 'Invalid duration. Use formats like 1h, 30m, 2d.', ephemeral: true });
    }

    await member.roles.add(mutedRole, reason);

    const embed = new EmbedBuilder()
      .setTitle('User Temporarily Muted')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Duration', value: duration, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setColor('Orange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Tempmute', target, interaction.user, `${reason} | Duration: ${duration}`);

    setTimeout(async () => {
      const updatedMember = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (updatedMember && updatedMember.roles.cache.has(mutedRole.id)) {
        await updatedMember.roles.remove(mutedRole, 'Temporary mute expired.');

        const unmuteEmbed = new EmbedBuilder()
          .setTitle('Temporary Mute Expired')
          .addFields(
            { name: 'User', value: `${target.tag}`, inline: true },
            { name: 'Moderator', value: 'System', inline: true },
            { name: 'Reason', value: 'Temporary mute expired.' }
          )
          .setColor('Green')
          .setTimestamp();

        const logChannel = await client.channels.fetch(config.logChannelId).catch(() => null);
        if (logChannel) logChannel.send({ embeds: [unmuteEmbed] });
      }
    }, durationMs);
  }
};
