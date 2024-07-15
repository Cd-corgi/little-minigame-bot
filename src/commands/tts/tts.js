const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const config = require('../../models/tts-config')
const { AudioPlayer, joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice')
const tts = require('discord-tts')

module.exports = {
    permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
    botp: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
    inVoiceChannel: true,
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
        const choice = interaction.options.getString("caption")
        let getPlayer = await config.findOne({ userId: interaction.user.id })

        if (!getPlayer) return interaction.reply({ content: `You do not have any configuration yet.. use \`/tts-cofnig\` to setting up!`, ephemeral: true })

        let audioPlayer = new AudioPlayer()
        let voiceCon;
        let opt = { command: "" }

        if (client.tts.get(interaction.user.id)) return interaction.reply({ content: `You are already using the TTS system`, ephemeral: true });

        switch (choice) {
            case "you":
                opt.command = "user"
                break;
            case "channel":
                opt.command = "channel"
                break;
        }

        try {
            let guild = await client.guilds.fetch(interaction.guild.id)
            let chan = guild.channels.cache.get(interaction.member.voice.channel.id)
            
            voiceCon = joinVoiceChannel({ channelId: chan.id, guildId: interaction.guild.id, adapterCreator: chan.guild.voiceAdapterCreator });
            voiceCon = await entersState(voiceCon, VoiceConnectionStatus.Connecting, 5_000);
            voiceCon.subscribe(audioPlayer)

            opt.channel = interaction.channel.id
            opt.author = interaction.user.id

            client.tts.set(interaction.user.id, opt)
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`TTS Auto-join system`).setDescription(`This bot just joined in <#${chan.id}> because <@${interaction.user.id}> executed the command.\n\nFrom the next message, this channel will be the TTS message input until the user leaves the channel.`).setColor("Blurple").setTimestamp()] })
        } catch (error) {
            console.log(error)
        }
    }
}