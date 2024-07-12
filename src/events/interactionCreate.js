const Discord = require('discord.js')
module.exports = async (client, interaction) => {
    if (interaction.type == Discord.InteractionType.ApplicationCommand) {
        let slashCmd = client.commands.get(interaction.commandName)
        if (!slashCmd) return;
        const user = interaction.guild.members.cache.get(interaction.user.id);
        if (!user.permissions.has(slashCmd.permissions || [])) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(":x: | Permission Error")
                        .setDescription(`Please get the enough permissions to do the commands!\nPermissions:\n\`${new Discord.PermissionsBitField(slashCmd.permissions).toArray().join("\`, \`")}\``)
                        .setTimestamp()
                        .setColor(Discord.Colors.Red)
                ],
                ephemeral: true
            })
        }
        if (!interaction.guild.members.me.permissions.has(slashCmd.botP || [])) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(":x: | Permission Error")
                        .setDescription(`Please give me the enough permissions to do the commands!\nPermissions:\n\`${new Discord.PermissionsBitField(slashCmd.botP).toArray().join("\`, \`")}\``)
                        .setTimestamp()
                        .setColor(Discord.Colors.Red)
                ],
                ephemeral: true
            })
        }
        try {
            await slashCmd.run(client, interaction)
        } catch (error) {
            console.log("\x1b[41m", error, "\x1b[0m")
        }
    }
}