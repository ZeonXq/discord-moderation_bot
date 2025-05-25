const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { addWarn } = require('../../utils/warnManager');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user for inappropriate behavior.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const moderator = interaction.user;

    addWarn(target.id, interaction.guild.id, {
      reason,
      moderator: moderator.tag,
      date: new Date().toISOString()
    });

    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('⚠️ You Have Been Warned')
        .setDescription(`You received a warning in **${interaction.guild.name}**.`)
        .addFields(
          { name: 'Warned By', value: moderator.tag, inline: true },
          { name: 'Reason', value: reason }
        )
        .setColor('Orange')
        .setTimestamp();

      await target.send({ embeds: [dmEmbed] });
    } catch (err) {
      console.warn(`Failed to send DM to ${target.tag}`);
    }

    const embed = new EmbedBuilder()
      .setTitle('User Warned')
      .addFields(
        { name: 'User', value: target.tag, inline: true },
        { name: 'Moderator', value: moderator.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setColor('Yellow')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Warn', target, moderator, reason);
  }
};
