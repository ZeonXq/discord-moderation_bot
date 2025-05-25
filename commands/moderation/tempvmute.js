const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempvmute')
    .setDescription('Temporarily server mutes a user in a voice channel.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to temp voice mute').setRequired(true))
    .addStringOption(option =>
      option.setName('duration').setDescription('Mute duration (e.g. 10m, 1h)').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for temporary voice mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member || !member.voice.channel) {
      return interaction.reply({ content: 'User must be in a voice channel to be muted.', ephemeral: true });
    }

    const durationMs = ms(duration);
    if (!durationMs || durationMs < 1000) {
      return interaction.reply({ content: 'Invalid duration. Use formats like 10m, 1h, 2d.', ephemeral: true });
    }

    if (member.voice.serverMute) {
      return interaction.reply({ content: 'This user is already server muted.', ephemeral: true });
    }

    await member.voice.setMute(true, reason);

    const embed = new EmbedBuilder()
      .setTitle('User Temporarily Voice Muted')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Duration', value: duration, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setColor('Blurple')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Temp Voice Mute', target, interaction.user, `${reason} | Duration: ${duration}`);

    setTimeout(async () => {
      const updated = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (updated && updated.voice.serverMute) {
        await updated.voice.setMute(false, 'Temporary voice mute expired');

        const unmuteEmbed = new EmbedBuilder()
          .setTitle('Temporary Voice Mute Expired')
          .addFields(
            { name: 'User', value: `${target.tag}`, inline: true },
            { name: 'Moderator', value: 'System', inline: true },
            { name: 'Reason', value: 'Temporary voice mute expired.' }
          )
          .setColor('Green')
          .setTimestamp();

        const logChannel = await client.channels.fetch(require('../../config/config.json').logChannelId).catch(() => null);
        if (logChannel) logChannel.send({ embeds: [unmuteEmbed] });
      }
    }, durationMs);
  }
};
