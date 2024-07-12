const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const perfil = require('../../models/players')
const { LoadGame } = require('../../utils/classes')
const { createCards } = require('../../utils/functions')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages],
    botp: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your progress..."),
    async run(client, interaction) {
        let detectPlayer = client.players.get(interaction.user.id) == undefined ? await perfil.findOne({ userId: interaction.user.id }) : client.players.get(interaction.user.id)
        if (!detectPlayer) {
            detectPlayer = new perfil({ userId: interaction.user.id }).save()
        }
        await interaction.deferReply()
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Profile`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields(
                        { name: `Player Name`, value: `**${interaction.user.username}**`, inline: true },
                        { name: `Money`, value: `\`${detectPlayer.stats.money}\``, inline: true },
                        { name: `Statistics`, value: `**W** \`${await detectPlayer.stats.wins}\` | **L** \`${await detectPlayer.stats.loses}\` | **Win Rate**: ${isNaN(((detectPlayer.stats.wins + 0.5 * detectPlayer.stats.loses) / (detectPlayer.stats.wins + detectPlayer.stats.loses) * 100).toFixed(2)) ? 0 : ((detectPlayer.stats.wins + 0.5 * detectPlayer.stats.loses) / (detectPlayer.stats.wins + detectPlayer.stats.loses) * 100).toFixed(2)}%` },
                    )
            ]
        })
    }
}