const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets slowmode duration for the current channel.')
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Time between messages (e.g., 5s, 10s, 1m, 0 to disable)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const durationStr = interaction.options.getString('duration');
    let duration = 0;

    if (durationStr !== '0') {
      duration = ms(durationStr) / 1000;
      if (isNaN(duration) || duration < 1 || duration > 21600) {
        return interaction.reply({
          content: 'Invalid duration. Must be between 1s and 6h (use formats like `5s`, `10s`, `1m`, or `0` to disable).',
          ephemeral: true
        });
      }
    }

    await interaction.channel.setRateLimitPerUser(duration);

    const embed = new EmbedBuilder()
      .setTitle('Slowmode Updated')
      .setDescription(`Slowmode has been set to **${durationStr === '0' ? 'disabled' : durationStr}** in this channel.`)
      .setColor('Blue')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Slowmode', interaction.channel, interaction.user, `Duration: ${durationStr}`);
  }
};
