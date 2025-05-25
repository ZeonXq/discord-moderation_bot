module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[ERROR] Error executing command: ${error}`);
      await interaction.reply({ content: 'KAn error occurred while executing the command.', ephemeral: true });
    }
  }
};
