const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a specified number of recent messages in this channel.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (max 100)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: 'Please enter a number between 1 and 100.',
        ephemeral: true
      });
    }

    if (interaction.channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content: 'This command can only be used in text channels.',
        ephemeral: true
      });
    }

    await interaction.channel.bulkDelete(amount, true).catch(() => {});

    const embed = new EmbedBuilder()
      .setTitle('Messages Deleted')
      .setDescription(`🧹 Deleted **${amount}** message(s) in this channel.`)
      .setColor('DarkGrey')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    logAction(client, 'Purge', interaction.channel, interaction.user, `Deleted ${amount} message(s)`);
  }
};
