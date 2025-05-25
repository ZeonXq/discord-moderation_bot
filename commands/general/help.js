const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available moderation commands.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛡️ Moderation Bot Help')
      .setDescription('Here are the available moderation commands:')
      .addFields(
        { name: '/ban', value: 'Permanently bans a user.' },
        { name: '/unban', value: 'Unbans a user by ID.' },
        { name: '/mute', value: 'Mutes a user indefinitely (gives muted role).' },
        { name: '/unmute', value: 'Removes muted role from a user.' },
        { name: '/tempmute', value: 'Mutes a user for a specific time.' },
        { name: '/vmute', value: 'Voice mutes a user in VC.' },
        { name: '/vunmute', value: 'Removes voice mute from a user.' },
        { name: '/tempvmute', value: 'Temporarily voice mutes a user.' },
        { name: '/warn', value: 'Warns a user.' },
        { name: '/warns', value: 'Lists a user’s warnings.' },
        { name: '/remove-warn', value: 'Removes a specific warning.' },
        { name: '/lock', value: 'Locks the current channel.' },
        { name: '/unlock', value: 'Unlocks the current channel.' },
        { name: '/slowmode', value: 'Sets slowmode delay.' },
        { name: '/purge', value: 'Deletes recent messages.' },
        { name: '/log-active', value: 'Enables logging to the current channel.' },
        { name: '/log-deactive', value: 'Disables logging.' }
      )
      .setColor('Blue')
      .setFooter({ text: 'Moderation Bot by ZeonXq' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
