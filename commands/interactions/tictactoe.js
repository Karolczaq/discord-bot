import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Challenge a user!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to challenge.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const author = interaction.user;
    const target = interaction.options.getUser("target");
    if (author.id === target.id) {
      return interaction.reply({
        content: "You can't challenge yourself!",
        ephemeral: true,
      });
    }
    const acceptButton = new ButtonBuilder()
      .setCustomId(`tictactoe_accept_${author.id}`)
      .setLabel("Accept Challenge")
      .setStyle(ButtonStyle.Success);

    const declineButton = new ButtonBuilder()
      .setCustomId(`tictactoe_decline_${author.id}`)
      .setLabel("Decline Challenge")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      acceptButton,
      declineButton
    );

    try {
      await target.send({
        content: `${author.displayName} challenged you to a game of Tic-Tac-Toe!`,
        components: [row],
      });
      return interaction.reply({
        content: `Challenge sent to ${target.displayName}! They will receive a private message with the challenge.`,
        ephemeral: true,
      });
    } catch (error) {
      return interaction.reply({
        content: `Couldn't send a private challenge to ${target.displayName}. They might have DMs disabled.`,
        ephemeral: true,
      });
    }
  },
};
