const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config/config.json');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Removes the muted role from a user.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to unmute').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for unmute').setRequired(false))
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

    if (!member.roles.cache.has(mutedRole.id)) {
      return interaction.reply({ content: 'This user is not muted.', ephemeral: true });
    }

    await member.roles.remove(mutedRole, reason);

    const embed = new EmbedBuilder()
      .setTitle('User Unmuted')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setColor('DarkGreen')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Unmute', target, interaction.user, reason);
  }
};
