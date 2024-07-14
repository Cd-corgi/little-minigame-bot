const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const player = require('../../models/players')
const { LoadGame } = require('../../utils/classes')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName("card-game")
        .setDescription("Play a little simple card game!"),
    async run(client, interaction) {
        let detectProfile = await player.findOne({ userId: interaction.user.id })
        if (!detectProfile) return interaction.reply({ content: `You do not have a profile to count the stats. Please, create one!`, ephemeral: true })
        if (client.players.get(interaction.user.id)) return interaction.reply({ content: `You are already playing a match!`, ephemeral: true })
        try {
            const loadE = new LoadGame(client)
            await loadE.loadGameCards(interaction.user.id, interaction)
        } catch (error) {

        }
    }
}