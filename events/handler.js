export default {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isButton()) {
      const customId = interaction.customId;
      if (customId.startsWith("tictactoe_accept_")) {
        const challengerId = customId.split("_")[2];
        const challenger = await interaction.client.users.fetch(challengerId);
        await interaction.reply({
          content: `You accepted ${challenger.displayName}'s challenge! Starting the game...`,
        });
      } else if (customId.startsWith("tictactoe_decline_")) {
        const challengerId = customId.split("_")[2];
        const challenger = await interaction.client.users.fetch(challengerId);

        await interaction.reply({
          content: `You declined ${challenger.displayName}'s challenge.`,
        });
      }
    } else if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }
  },
};
