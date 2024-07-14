const dtts = require('discord-tts')
const { VoiceConnectionStatus, joinVoiceChannel, entersState, createAudioResource, StreamType, AudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const playerConfig = require('../models/tts-config')

module.exports = async (client, oldS, newS) => {

    let voiceCon;
    let audioPlayer = new AudioPlayer()
    let findUser = await playerConfig.findOne({ userId: newS.id })
    let talk;

    if (oldS.channelId == null && newS.channelId !== null) {
        const getGuild = await client.guilds.fetch(newS.guild.id)
        const getChan = getGuild.channels.cache.get(newS.channelId)

        if (findUser) {
            if (findUser.joinWhenUserJoin) {
                voiceCon = joinVoiceChannel({ channelId: getChan.id, guildId: getGuild.id, adapterCreator: getChan.guild.voiceAdapterCreator });

                switch (findUser.lang) {
                    case "es-ES":
                        talk = dtts.getVoiceStream("Me he unido por tu configuración personal.", "es-ES", 125)
                        break;
                    case "pt-BR":
                        talk = dtts.getVoiceStream("Entrei por causa das suas configurações pessoais", "pt-BR", 125)
                        break;
                    case "en-US":
                        talk = dtts.getVoiceStream("I joined because of your personal settings.", "en-US", 125)
                        break;
                }

                voiceCon = await entersState(voiceCon, VoiceConnectionStatus.Connecting, 5_000);
                const audioRes = createAudioResource(talk, { inputType: StreamType.Arbitrary, inlineVolume: true })

                voiceCon.subscribe(audioPlayer)
                audioPlayer.play(audioRes)
                try {
                    client.tts.set(getChan.id, getChan)
                } catch (error) {
                    console.log(error)
                }
            } else {
                return
            }
        }
    }

    if (oldS.channelId !== null && newS.channelId == null) {
        if (findUser) {
            const connection = getVoiceConnection(newS.guild.id)
            try {
                connection.disconnect();
            } catch (error) { }
        }
    }
}