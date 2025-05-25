const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server by their user ID.')
    .addStringOption(option =>
      option.setName('userid').setDescription('User ID to unban').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for unbanning').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.bans.remove(userId, reason);

      const embed = new EmbedBuilder()
        .setTitle('User Unbanned')
        .addFields(
          { name: 'User ID', value: userId, inline: true },
          { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: 'Reason', value: reason }
        )
        .setColor('Green')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      let user = { tag: 'Unknown', id: userId };
      try {
        const fetched = await client.users.fetch(userId);
        user = fetched;
      } catch {}

      logAction(client, 'Unban', user, interaction.user, reason);
    } catch (error) {
      console.error('Unban error:', error);
      await interaction.reply({
        content: 'Failed to unban the user. Make sure the ID is valid and the user is banned.',
        ephemeral: true
      });
    }
  }
};
