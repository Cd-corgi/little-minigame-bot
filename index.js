const Discord = require('discord.js')
const client = new Discord.Client({ intents: [3276543] })
const { token, id } = require('./src/config/config.json')
const fs = require('fs')
const dtts = require('discord-tts')
const voice = require('@discordjs/voice')

require('./src/utils/mongoose')();

process.on('unhandledRejection', error => { console.error("\x1b[41m", `[UNHANDLED ALARM] ${error}`, "\x1b[0m"); console.log(error) });
client.on('shardError', error => { console.error(`[SHARD ALARM] ${error}`); console.log(error) });

client.commands = new Discord.Collection();
client.players = new Discord.Collection();

fs.readdir("./src/events", (err, files) => {
    if (err) console.error;
    files.forEach((f) => {
        if (!f.endsWith(".js")) return;
        let eName = f.split(".")[0]
        const event = require(`./src/events/${f}`)
        client.on(eName, event.bind(null, client))
    })
})

fs.readdirSync("./src/commands").forEach((cat) => {
    const comm = fs.readdirSync(`./src/commands/${cat}`).filter((f) => f.endsWith(".js"))
    for (const cmd of comm) {
        let cmdFile = require(`./src/commands/${cat}/${cmd}`);
        client.commands.set(cmdFile.data.name, cmdFile)
    }
})

loadDash(token, id);
client.login(token).then(() => console.log(client.user.tag + " Logged In!"))

function loadDash(tk, bid) {
    var cmds = [];
    fs.readdirSync("./src/commands").forEach(category => {
        const comm = fs.readdirSync(`./src/commands/${category}`).filter(f => f.endsWith(".js")); for (const command of comm) { let commandFile = require(`./src/commands/${category}/${command}`); cmds.push(commandFile.data.toJSON()) }
    }); const rest = new Discord.REST({ version: "10" }).setToken(tk);
    Slash();
    async function Slash() {
        try {
            rest.put(Discord.Routes.applicationCommands(bid), { body: cmds });
            console.log(cmds.length + " Commands Loaded")
        } catch (error) { console.log(error) }
    }
}