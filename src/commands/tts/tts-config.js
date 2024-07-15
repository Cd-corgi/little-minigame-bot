const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('../../models/tts-config')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    data: new SlashCommandBuilder()
        .setName("tts-config")
        .setDescription("Setting up your personal config to the TTS command."),
    async run(client, interaction) {
        var checkUser = await config.findOne({ userId: interaction.user.id })

        if (!checkUser) checkUser = new config({ userId: interaction.user.id }).save()

        const rowLang = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("language")
                    .addOptions(
                        { label: `Spanish`, value: `es-ES`, emoji: `🇪🇸` },
                        { label: `English`, value: `en-US`, emoji: `🇺🇸` },
                        { label: `Portuguese`, value: `pt-BR`, emoji: `🇵🇹` },
                        { label: `Japanese`, value: `ja-JP`, emoji: `🇯🇵` },
                        { label: `Russian`, value: `ru-RU`, emoji: `🇷🇺` },
                    )
                    .setPlaceholder(`Select a language`))

        const rowOption = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId("autojoin").setLabel("Auto-join").setStyle(await checkUser.joinWhenUserJoin == false ? ButtonStyle.Danger : ButtonStyle.Success)).addComponents(new ButtonBuilder().setCustomId("close").setLabel(`Close menu`).setStyle(ButtonStyle.Danger))

        let msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`TTS Config`).setDescription(`Setting up your personal settings to the bot! (The output channel will be the Voice Channel Chat!)`).setColor("Blue").setThumbnail(client.user.displayAvatarURL()).setTimestamp().setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })], components: [rowOption, rowLang] })

        let filter = i => i.user.id == interaction.user.id

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 250000, idle: 30000 })

        collector.on("collect", async i => {
            await i?.deferUpdate();
            switch (i.componentType) {
                case 2:
                    if (i.customId == "autojoin") {
                        if (checkUser.joinWhenUserJoin == true) {
                            checkUser.joinWhenUserJoin = false
                            rowOption.components[0].setStyle(ButtonStyle.Danger)
                        } else {
                            checkUser.joinWhenUserJoin = true
                            rowOption.components[0].setStyle(ButtonStyle.Success)
                        }
                        await config.findOneAndUpdate({ userId: interaction.user.id }, { joinWhenUserJoin: checkUser.joinWhenUserJoin })
                        await i.editReply({
                            content: `✅ Autojoining have been **${checkUser.joinWhenUserJoin == true ? 'Enabled' : 'Disabled'}**`,
                            components: [rowOption, rowLang]
                        })
                        collector.resetTimer()
                    } else if (i.customId == "close") {
                        await i.deleteReply()
                        collector.stop()
                    }
                    break;
                case 3:
                    let updated = await config.findOneAndUpdate({ userId: interaction.user.id }, { lang: i.values[0] }, { new: true })
                    await i.editReply({ content: `✅ The language have been setted up as ${updated.lang}`, components: [rowOption, rowLang] })
                    collector.resetTimer()
                    break;
            }
        })
    }
}