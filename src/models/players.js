const mongoose = require('mongoose')

const Schem = new mongoose.Schema({
    userId: String,
    stats: {
        money: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        loses: { type: Number, default: 0 },
    },
    inventory: []
})

module.exports = mongoose.model("players", Schem)