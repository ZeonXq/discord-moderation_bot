const { EmbedBuilder } = require('discord.js');
const config = require('../config/config.json');

async function logAction(client, action, user, moderator, reason) {
  if (!config.logChannelId) return;

  const logChannel = await client.channels.fetch(config.logChannelId).catch(() => null);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setTitle('Moderation Action Logged')
    .addFields(
      { name: 'Action', value: action, inline: true },
      { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
      { name: 'Moderator', value: `${moderator.tag} (${moderator.id})`, inline: true },
      { name: 'Reason', value: reason || 'No reason provided', inline: false }
    )
    .setColor('Orange')
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
}

module.exports = { logAction };
