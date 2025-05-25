client.once('ready', () => {
  console.log(`[BOT READY] Logged in as ${client.user.tag}`);
  client.user.setActivity('/help', { type: 0 });
});
