const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, ComponentType } = require('discord.js')
const players = require('../models/players')
const { createCards } = require('./functions')

class LoadGame {
    /**
     * @param {Client} client The Bot's Client
     */
    constructor(client) {
        this.client = client
    }

    /**
     * @param {string} player The Player's ID
     * @param {Interaction} interaction The game's interaction
     */
    async loadGameCards(player, interaction) {
        var gameDesign = { cpu: { life: 3, cards: [] }, player: { life: 3, cards: [] }, turn: 0, currentCard: { player: "", cpu: "" } }
        let getGeneratedCards = await createCards()
        gameDesign.cpu.cards = getGeneratedCards.cpu; gameDesign.player.cards = getGeneratedCards.player;
        this.client.players.set(player, gameDesign)
        await this.gameEngine(interaction)
    }

    /**
     * @param {Interaction} interaction The command's interaction!
     */
    async gameEngine(interaction) {
        let playerRow = new ActionRowBuilder()
        var getStats = this.client.players.get(interaction.user.id)

        if (!getStats) throw Error(">> [GameEngineUndefinedStatistics] The Card Game's Stats couldn't be found!")

        getStats.player.cards.forEach((x, i) => { playerRow.addComponents(new ButtonBuilder().setCustomId(`c${i}`).setLabel(`${x == 11 ? '❤' : x == 12 ? '💖' : x == 13 ? '💝' : x} 🃏`).setStyle(ButtonStyle.Secondary)) })

        let msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`A Simple Card Game`).setThumbnail(interaction.user.displayAvatarURL()).addFields({ name: `${interaction.user.username} Cards`, value: `🃏`.repeat(getStats.player.cards.length), inline: true }, { name: `Lives`, value: `\`${getStats.player.life}\` ❤`, inline: true }, { name: `Desk`, value: `${getStats.currentCard.player.length < 1 ? "🚫 🃏" : `${getStats.currentCard.player} 🃏`} | ${getStats.currentCard.cpu.length < 1 ? "🃏 🚫" : `🃏 ${getStats.currentCard.cpu}`}` }, { name: `CPU's Cards`, value: getStats.cpu.cards.length >= 1 ? `🃏`.repeat(getStats.cpu.cards.length) : "No cards left", inline: true }, { name: `Lives`, value: `\`${getStats.cpu.life}\` ❤`, inline: true },)], components: [playerRow] })

        let filter = i => i.user.id == interaction.user.id

        const collector = interaction.channel.createMessageComponentCollector({ time: 50000, filter, componentType: ComponentType.Button })

        collector.on("collect", async i => {
            await i?.deferUpdate();
            var choiceidX = i.customId.split("c").filter((x) => x.length >= 1)[0];
            getStats.currentCard.player = `${getStats.player.cards[choiceidX]}`
            playerRow.components = []
            if (getStats.player.cards.length > 1) {
                getStats.player.cards.splice(choiceidX, 1)
                getStats.player.cards.forEach((x, i) => { playerRow.addComponents(new ButtonBuilder().setCustomId(`c${i}`).setLabel(`${x == 11 ? '❤' : x == 12 ? '💖' : x == 13 ? '💝' : x} 🃏`).setStyle(ButtonStyle.Secondary)) })
                i.editReply({ content: `_ _`, embeds: [new EmbedBuilder().setTitle(`A Simple Card Game`).setThumbnail(interaction.user.displayAvatarURL()).addFields({ name: `${interaction.user.username} Cards`, value: getStats.player.cards.length < 1 ? "No cards left." : `🃏`.repeat(getStats.player.cards.length), inline: true }, { name: `Lives`, value: `\`${getStats.player.life}\` ❤`, inline: true }, { name: `Desk`, value: `${getStats.currentCard.player.length < 1 ? "🚫 🃏" : `${getStats.currentCard.player} 🃏`} | ${getStats.currentCard.cpu.length < 1 ? "🃏 🚫" : `🃏 ${getStats.currentCard.cpu}`}` }, { name: `CPU's Cards`, value: getStats.cpu.cards.length >= 1 ? `🃏`.repeat(getStats.cpu.cards.length) : "No cards left", inline: true }, { name: `Lives`, value: `\`${getStats.cpu.life}\` ❤`, inline: true },)], components: [] })
            } else {
                getStats.player.cards = []
                i.editReply({ content: `_ _`, embeds: [new EmbedBuilder().setTitle(`A Simple Card Game`).setThumbnail(interaction.user.displayAvatarURL()).addFields({ name: `${interaction.user.username} Cards`, value: getStats.player.cards.length < 1 ? "No cards left." : `🃏`.repeat(getStats.player.cards.length), inline: true }, { name: `Lives`, value: `\`${getStats.player.life}\` ❤`, inline: true }, { name: `Desk`, value: `${getStats.currentCard.player.length < 1 ? "🚫 🃏" : `${getStats.currentCard.player} 🃏`} | ${getStats.currentCard.cpu.length < 1 ? "🃏 🚫" : `🃏 ${getStats.currentCard.cpu}`}` }, { name: `CPU's Cards`, value: getStats.cpu.cards.length >= 1 ? `🃏`.repeat(getStats.cpu.cards.length) : "No cards left", inline: true }, { name: `Lives`, value: `\`${getStats.cpu.life}\` ❤`, inline: true },)], components: [] })
            }
            if (getStats.cpu.cards.length >= 1) {
                var CPU = getStats.cpu.cards[Math.floor(Math.random() * getStats.cpu.cards.length)]
                getStats.currentCard.cpu = `${CPU}`
                getStats.cpu.cards.splice(getStats.cpu.cards.indexOf(CPU), 1)
            } else {
                getStats.cpu.cards = []
            }
            setTimeout(async () => {
                i.editReply({ embeds: [new EmbedBuilder().setTitle(`A Simple Card Game`).setThumbnail(interaction.user.displayAvatarURL()).addFields({ name: `${interaction.user.username} Cards`, value: getStats.player.cards.length < 1 ? "No cards left." : `🃏`.repeat(getStats.player.cards.length), inline: true }, { name: `Lives`, value: `\`${getStats.player.life}\` ❤`, inline: true }, { name: `Desk`, value: `${getStats.currentCard.player.length < 1 ? "🚫 🃏" : `${getStats.currentCard.player} 🃏`} | ${getStats.currentCard.cpu.length < 1 ? "🃏 🚫" : `🃏 ${getStats.currentCard.cpu}`}` }, { name: `CPU's Cards`, value: getStats.cpu.cards.length >= 1 ? `🃏`.repeat(getStats.cpu.cards.length) : "No cards left", inline: true }, { name: `Lives`, value: `\`${getStats.cpu.life}\` ❤`, inline: true },)], components: [] })
                var prompt = ""
                var result = this.compareCards(getStats.currentCard)
                switch (result) {
                    case 0:
                        prompt = `The CPU's selected card overpass your card number!`
                        getStats.player.life--
                        break;
                    case 1:
                        prompt = `Your Selected card overpass the CPU's card number!`
                        getStats.cpu.life--
                        break;
                    default:
                        prompt = `Both players just shown the same card number!`
                        break;
                }
                if (getStats.player.life < 1 || getStats.cpu.life < 1) {
                    i.editReply({
                        content: `${getStats.cpu.life < 1 ? `## Congratulations ${interaction.user.username}, you are the winner!` : `## The CPU is the winner, be lucky for the next time!`}`,
                        embeds: [new EmbedBuilder().setTitle(`A Simple Card Game`).setThumbnail(interaction.user.displayAvatarURL()).addFields({ name: `${interaction.user.username} Cards`, value: getStats.player.cards.length < 1 ? "No cards left." : `🃏`.repeat(getStats.player.cards.length), inline: true }, { name: `Lives`, value: `\`${getStats.player.life}\` ❤`, inline: true }, { name: `Desk`, value: `${getStats.currentCard.player.length < 1 ? "🚫 🃏" : `${getStats.currentCard.player} 🃏`} | ${getStats.currentCard.cpu.length < 1 ? "🃏 🚫" : `🃏 ${getStats.currentCard.cpu}`}` }, { name: `CPU's Cards`, value: getStats.cpu.cards.length >= 1 ? `🃏`.repeat(getStats.cpu.cards.length) : "No cards left", inline: true }, { name: `Lives`, value: `\`${getStats.cpu.life}\` ❤`, inline: true },)],
                        components: []
                    })
                    collector.stop()
                    this.client.players.delete(interaction.user.id)
                } else {
                    if (getStats.player.cards.length < 1 && getStats.cpu.cards.length < 1) {
                        let regenerateCards = await createCards()
                        getStats.player.cards = regenerateCards.player; getStats.cpu.cards = regenerateCards.cpu;
                    }
                    i.editReply({
                        content: `${prompt.length >= 1 ? `${prompt}` : "_ _"}`,
                        embeds: [new EmbedBuilder().setTitle(`A Simple Card Game`).setThumbnail(interaction.user.displayAvatarURL()).addFields({ name: `${interaction.user.username} Cards`, value: getStats.player.cards.length < 1 ? "No cards left." : `🃏`.repeat(getStats.player.cards.length), inline: true }, { name: `Lives`, value: `\`${getStats.player.life}\` ❤`, inline: true }, { name: `Desk`, value: `${getStats.currentCard.player.length < 1 ? "🚫 🃏" : `${getStats.currentCard.player} 🃏`} | ${getStats.currentCard.cpu.length < 1 ? "🃏 🚫" : `🃏 ${getStats.currentCard.cpu}`}` }, { name: `CPU's Cards`, value: getStats.cpu.cards.length >= 1 ? `🃏`.repeat(getStats.cpu.cards.length) : "No cards left", inline: true }, { name: `Lives`, value: `\`${getStats.cpu.life}\` ❤`, inline: true },)],
                        components: [playerRow]
                    })
                    collector.resetTimer()
                }
            }, 5000)
        })
    }

    /**
     * @param {object} currentCards The current cards that will be used to the game logic.
     * @todo This function will return a number that will define if the CPU or Player just win or draw
     * @returns If one of the cards are more than the another one, will substrate 1 life point to the loser.
     */
    compareCards(currentCards) {
        var str2nmbPly = parseInt(currentCards.player); var str2nmbCpu = parseInt(currentCards.cpu);
        if (str2nmbPly > str2nmbCpu) {
            return 1
        } else if (str2nmbCpu > str2nmbPly) {
            return 0
        } else {
            return 2
        }
    }
}

module.exports = { LoadGame }