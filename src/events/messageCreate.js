const Discord = require('discord.js')
const dtts = require('discord-tts')
const { getVoiceConnection, entersState, VoiceConnectionStatus, AudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice')
const userConfig = require('../models/tts-config')

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    let detectUser = await userConfig.findOne({ userId: message.author.id })

    if (!detectUser) return;

    const connection = getVoiceConnection(message.guild.id)

    if (!connection) return;

    const getOutPutChannel = client.tts.get(message.author.id)

    if (!getOutPutChannel || getOutPutChannel.channel !== message.channel.id) return;

    try {
        const audioPlayer = new AudioPlayer()
        let msg = await message.channel.messages.fetch()

        if (getOutPutChannel.command == "user") {
            let getMsg = msg.first();

            if (getMsg.author.id !== getOutPutChannel.author) return;

            getMsg = getMsg.content

            let regMention = /<@|>/gm

            if (regMention.test(getMsg)) {
                var getIds = getMsg.split(" ").filter((x) => x.includes("<@") && x.includes(">"))
                
                for (let i = 0; i < getIds.length; i++) {
                    getIds[i] = getIds[i].replace(/<@|>/gm, "")
                    var fetchNames = await client.users.fetch(getIds[i])
                    getMsg = getMsg.replace(`<@${fetchNames.id}>`, fetchNames.username)
                }
            }

            let audioPrompt = dtts.getVoiceStream(`${message.author.username}. ${getMsg}`, detectUser.lang)
            let audioRes = createAudioResource(audioPrompt, { inputType: StreamType.Arbitrary, inlineVolume: true })

            connection.subscribe(audioPlayer)
            audioPlayer.play(audioRes)
        } else {
            let getMsg = msg.first().content;

            let regMention = /<@|>/gm

            if (regMention.test(getMsg)) {
                var getIds = getMsg.split(" ").filter((x) => x.includes("<@") && x.includes(">"))
                for (let i = 0; i < getIds.length; i++) {
                    getIds[i] = getIds[i].replace(/<@|>/gm, "")
                    var fetchNames = await client.users.fetch(getIds[i])
                    getMsg = getMsg.replace(`<@${fetchNames.id}>`, fetchNames.username)
                }
            }

            let audioPrompt = dtts.getVoiceStream(`${message.author.username}. ${getMsg}`, detectUser.lang)
            let audioRes = createAudioResource(audioPrompt, { inputType: StreamType.Arbitrary, inlineVolume: true })

            connection.subscribe(audioPlayer)
            audioPlayer.play(audioRes)
        }


    } catch (error) {
        console.error(error)
    }
}