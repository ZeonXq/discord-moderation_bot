const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getWarns, removeWarn } = require('../../utils/warnManager');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-warn')
    .setDescription('Removes a specific warning from a user.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to remove warning from').setRequired(true))
    .addIntegerOption(option =>
      option.setName('index').setDescription('Warning number (as shown in /warns)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const index = interaction.options.getInteger('index') - 1; // kullanıcı 1 yazarsa index 0 olmalı

    const warns = getWarns(target.id, interaction.guild.id);

    if (!warns || warns.length === 0) {
      return interaction.reply({ content: `${target.tag} has no warnings.`, ephemeral: true });
    }

    if (index < 0 || index >= warns.length) {
      return interaction.reply({ content: `Invalid index. Use /warns to see correct number.`, ephemeral: true });
    }

    const removedWarn = warns[index];
    const success = removeWarn(target.id, interaction.guild.id, index);

    if (!success) {
      return interaction.reply({ content: `Could not remove the warning.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('Warning Removed')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Removed By', value: `${interaction.user.tag}`, inline: true },
        { name: 'Original Reason', value: removedWarn.reason },
        { name: 'Original Moderator', value: removedWarn.moderator },
        { name: 'Original Date', value: `<t:${Math.floor(new Date(removedWarn.date).getTime() / 1000)}:F>` }
      )
      .setColor('Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Remove Warn', target, interaction.user, `Removed warn: ${removedWarn.reason}`);
  }
};
