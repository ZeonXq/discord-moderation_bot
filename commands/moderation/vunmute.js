const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vunmute')
    .setDescription('Unmutes a user in a voice channel.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to unmute').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for voice unmute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member || !member.voice.channel) {
      return interaction.reply({ content: 'User must be in a voice channel to be unmuted.', ephemeral: true });
    }

    if (!member.voice.serverMute) {
      return interaction.reply({ content: 'This user is not server muted.', ephemeral: true });
    }

    await member.voice.setMute(false, reason);

    const embed = new EmbedBuilder()
      .setTitle('User Voice Unmuted')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Voice Unmute', target, interaction.user, reason);
  }
};
