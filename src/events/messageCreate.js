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
    const getOutPutChannel = client.tts.get(message.channel.id)
    if (!getOutPutChannel || getOutPutChannel.id !== message.channel.id) return;
    try {
        const audioPlayer = new AudioPlayer()
        var msg = await message.channel.messages.fetch()
        var getMsg = msg.first().content;
        getMsg = getMsg.replace(/<@[0-9]+>/gm, ".")
        let audioPrompt = dtts.getVoiceStream(`${message.author.username}. ${getMsg}`, detectUser.lang)
        let audioRes = createAudioResource(audioPrompt, { inputType: StreamType.Arbitrary, inlineVolume: true })
        connection.subscribe(audioPlayer)
        audioPlayer.play(audioRes)
    } catch (error) {
        console.error(error)
    }
}