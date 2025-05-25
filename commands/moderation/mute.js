const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config/config.json');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user by assigning the muted role.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    }

    const mutedRole = interaction.guild.roles.cache.get(config.mutedRoleId);
    if (!mutedRole) {
      return interaction.reply({ content: 'Muted role not found. Check your config file.', ephemeral: true });
    }

    if (member.roles.cache.has(mutedRole.id)) {
      return interaction.reply({ content: 'This user is already muted.', ephemeral: true });
    }

    await member.roles.add(mutedRole, reason);

    const embed = new EmbedBuilder()
      .setTitle('User Muted')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setColor('DarkOrange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Mute', target, interaction.user, reason);
  }
};
