const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const config = require('../../models/tts-config')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    data: new SlashCommandBuilder()
        .setName("tts")
        .setDescription("Set and join the bot in your voice channel")
        .addStringOption(option =>
            option
                .setName("caption")
                .setDescription("Set the caption of the bot, for yourself or everyone in the channel...")
                .addChoices(
                    { name: "For you", value: "you" },
                    { name: "For channel", value: "channel" }
                )
                .setRequired(true)
        ),
    async run(client, interaction) {

    }
}