import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db/mongo.js";

export default {
  data: new SlashCommandBuilder()
    .setName("money")
    .setDescription("Shows how much coins you have"),
  async execute(interaction) {
    const userId = interaction.user.id;
    try {
      const user = await db.collection("users").findOne({ userId: userId });
      return interaction.reply({
        content: `You currently have ${user.coins} coins`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "There was an error processing your request",
        ephemeral: true,
      });
    }
  },
};
