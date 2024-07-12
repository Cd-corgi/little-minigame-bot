const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { LoadGame } = require('../../utils/classes')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName("card-game")
        .setDescription("Play a little simple card game!"),
    async run(client, interaction) {
        if (client.players.get(interaction.user.id)) return interaction.reply({ content: `You are already playing a match!`, ephemeral: true })
        try {
            const loadE = new LoadGame(client)
            await loadE.loadGameCards(interaction.user.id, interaction)
        } catch (error) {
            
        }
    }
}