const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const db = require('quick.db')

const token = cf.token
const botID = cf.botID

exports.run = async(client, message, args, comando) => {
    const dbv = require('../index.js')
    var mf = require(`../utils/idiomas/${dbv.idm}.json`)
    var prefix = dbv.prefix

    const a = db.fetch(`items_list`)
    
    message.channel.send(Object.entries(a))
    console.log(Object.entries(a))
}