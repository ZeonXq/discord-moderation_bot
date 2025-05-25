const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Locks the current channel for @everyone.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const channel = interaction.channel;

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    const embed = new EmbedBuilder()
      .setTitle('Channel Locked')
      .setDescription(`🔒 This channel has been locked for @everyone.`)
      .setColor('Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Lock Channel', channel, interaction.user, 'Locked via /lock command.');
  }
};
