const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config/config.json');
let config = require('../../config/config.json');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log-active')
    .setDescription('Activates logging and sets this channel as the log channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const logChannelId = interaction.channel.id;

    config.logChannelId = logChannelId;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Logging Activated')
      .setDescription(`All moderation actions will now be logged in <#${logChannelId}>.`)
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
