import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Poke an user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to poke")
        .setRequired(true)
    ),
  async execute(interaction) {
    const author = interaction.user;
    const target = interaction.options.getUser("target");

    if (author.id === target.id) {
      return interaction.reply({
        content: "You can't poke yourself!",
        ephemeral: true,
      });
    }
    return interaction.reply({
      content: `${author.displayName} poked ${target.displayName}!`,
    });
  },
};
