const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { logAction } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlocks the current channel for @everyone.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const channel = interaction.channel;

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: null // Sunucunun varsayılan ayarına geri döner (yani izin verir)
    });

    const embed = new EmbedBuilder()
      .setTitle('Channel Unlocked')
      .setDescription(`🔓 This channel is now unlocked for @everyone.`)
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    logAction(client, 'Unlock Channel', channel, interaction.user, 'Unlocked via /unlock command.');
  }
};
