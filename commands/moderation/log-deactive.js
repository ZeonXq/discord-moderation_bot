const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config/config.json');
let config = require('../../config/config.json');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log-deactive')
    .setDescription('Disables logging.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    config.logChannelId = null;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Logging Disabled')
      .setDescription('Moderation logs have been deactivated.')
      .setColor('Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
