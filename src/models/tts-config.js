const mongoose = require('mongoose')

const Schem = new mongoose.Schema({
    userId: String,
    lang: { type: String, default: "en-US" },
    joinWhenUserJoin: { type: Boolean, default: false },
})

module.exports = mongoose.model("tts", Schem)