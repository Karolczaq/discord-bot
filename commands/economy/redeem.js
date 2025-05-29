import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db/mongo.js";

export default {
  data: new SlashCommandBuilder()
    .setName("redeem")
    .setDescription("Redeem 100 coins"),
  async execute(interaction) {
    const userId = interaction.user.id;
    try {
      const user = await db.collection("users").findOneAndUpdate(
        { userId: userId },
        {
          $setOnInsert: {
            userId: userId,
            coins: 0,
            lastRedeem: null,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      const lastRedeem = user.lastRedeem;
      const now = new Date();
      if (lastRedeem && now.getTime() - lastRedeem.getTime() < 60 * 60 * 1000) {
        const nextRedeem = new Date(lastRedeem.getTime() + 60 * 60 * 1000);
        return interaction.reply({
          content: `You can redeem again in ${Math.ceil(
            (nextRedeem - now) / (1000 * 60)
          )} minutes`,
          ephemeral: true,
        });
      }

      await db.collection("users").updateOne(
        { userId: userId },
        {
          $inc: { coins: 100 },
          $set: { lastRedeem: now },
        }
      );

      return interaction.reply({
        content: `Successfully redeemed 100 coins! 🎉`,
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
