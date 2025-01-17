const dtts = require('discord-tts')
const { VoiceConnectionStatus, joinVoiceChannel, entersState, createAudioResource, StreamType, AudioPlayer, getVoiceConnection } = require('@discordjs/voice')
const playerConfig = require('../models/tts-config');
const { EmbedBuilder } = require('discord.js');

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
                    case "ja-JP":
                        talk = dtts.getVoiceStream("あなたの個人的な設定のため、私は参加しました。", "ja-JP", 125)
                        break;
                    case "ru-RU":
                        talk = dtts.getVoiceStream("Я присоединился из-за вашей личной конфигурации.", "ru-RU", 125)
                        break;
                }

                voiceCon = await entersState(voiceCon, VoiceConnectionStatus.Connecting, 5_000);
                const audioRes = createAudioResource(talk, { inputType: StreamType.Arbitrary, inlineVolume: true })

                voiceCon.subscribe(audioPlayer)
                audioPlayer.play(audioRes)
                try {
                    client.tts.set(newS.id, { channel: getChan.id, command: "channel", author: newS.id })
                    getChan.send({ embeds: [new EmbedBuilder().setTitle(`TTS Auto-join system`).setDescription(`This bot just joined in <#${getChan.id}> because <@${newS.id}> joined.\n\nFrom the next message, this channel will be the TTS message input until the user leaves the channel.`).setColor("Blurple").setTimestamp()] })
                } catch (error) {
                    console.log(error)
                }
            } else {
                return;
            }
        }
    } else if (oldS.channelId !== null && newS.channelId !== null) { return }

    if (oldS.channelId !== null && newS.channelId == null) {
        if (findUser) {
            const connection = getVoiceConnection(newS.guild.id)
            try {
                client.tts.delete(newS.channelId)
                if (connection) {
                    connection.disconnect();
                } else {
                    const connection2 = getVoiceConnection(oldS.guild.id)
                    connection2.destroy();
                }
            } catch (error) { }
        }
    }
}