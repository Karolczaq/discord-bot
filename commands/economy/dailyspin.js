import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db/mongo.js";

function RandomSpin() {
  const ranges = [
    { min: 50, max: 100, weight: 50 },
    { min: 100, max: 500, weight: 30 },
    { min: 500, max: 1000, weight: 15 },
    { min: 1000, max: 5000, weight: 5 },
  ];
  const totalWeight = ranges.reduce((sum, range) => sum + range.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  let selectedRange = ranges[0];

  for (const range of ranges) {
    randomWeight -= range.weight;
    if (randomWeight <= 0) {
      selectedRange = range;
      break;
    }
  }

  let reward = Math.floor(
    Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min
  );
  return reward;
}

export default {
  data: new SlashCommandBuilder()
    .setName("dailyspin")
    .setDescription("A command to spin a daily reward wheel"),
  async execute(interaction) {
    const userId = interaction.user.id;
    try {
      const user = await db.collection("users").findOneAndUpdate(
        { userId: userId },
        {
          $setOnInsert: {
            userId: userId,
            coins: 0,
            lastSpin: null,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      const lastSpin = user.lastSpin;
      const now = new Date();
      if (lastSpin && now.getTime() - lastSpin.getTime() < 1000) {
        const nextSpin = new Date(lastSpin.getTime() + 24 * 60 * 60 * 1000);
        return interaction.reply({
          content: `You can spin again in ${Math.ceil(
            (nextSpin - now) / (1000 * 60 * 60)
          )} hours`,
          ephemeral: true,
        });
      }
      const reward = RandomSpin();

      await db.collection("users").updateOne(
        { userId: userId },
        {
          $inc: { coins: reward },
          $set: { lastRedeem: now },
        }
      );

      return interaction.reply({
        content: `You won ${reward} coins! 🎉`,
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
