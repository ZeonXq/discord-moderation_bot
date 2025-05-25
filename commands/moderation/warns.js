const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getWarns } = require('../../utils/warnManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Shows all warnings of a user.')
    .addUserOption(option =>
      option.setName('user').setDescription('User to check warnings for').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warns = getWarns(target.id, interaction.guild.id);

    if (warns.length === 0) {
      return interaction.reply({
        content: `${target.tag} has no warnings.`,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Warnings for ${target.tag}`)
      .setColor('Yellow')
      .setTimestamp();

    warns.forEach((warn, index) => {
      embed.addFields({
        name: `#${index + 1}`,
        value: `**Reason:** ${warn.reason}\n**Moderator:** ${warn.moderator}\n**Date:** <t:${Math.floor(new Date(warn.date).getTime() / 1000)}:F>`,
        inline: false
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
