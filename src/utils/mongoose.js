const mongooose = require('mongoose')
const { mongo } = require('../config/config.json')

module.exports = async () => {
    try {
        mongooose.set("strictQuery", true)
        await mongooose.connect(mongo).then(() => console.log("Done!"))
    } catch (error) {
        console.log(error)
    }
}