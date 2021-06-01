const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

exports.run = async(client, message, args) => {
    var coins = db.fetch(`${message.author.id}.coins`)
    var banco_coins = db.fetch(`${message.author.id}.banco_coins`)
    var limite_carteira = db.fetch(`${message.author.id}.limite_carteira`)
    var nivel = db.fetch(`${message.author.id}.nivel`)
    var xp = db.fetch(`${message.author.id}.xp`)
    var limite_itens = db.fetch(`${message.author.id}.limite_itens`)
    var inventario_itens = db.fetch(`${message.author.id}.inventario_itens`)
    var arma_equipada = db.fetch(`${message.author.id}.arma_equipada`)
    var armadura_equipada = db.fetch(`${message.author.id}.armadura_equipada`)
    var magias_equipadas = db.fetch(`${message.author.id}.magias_equipadas`)
    var magias = db.fetch(`${message.author.id}.magias`)
    var armaduras = db.fetch(`${message.author.id}.armaduras`)
    var armas = db.fetch(`${message.author.id}.armas`)
    var jornada = db.fetch(`${message.author.id}.jornada`)

    if(jornada === true) return message.reply(`você já começou sua jornada!`)

    await db.set(`${message.author.id}.coins`, 2000)
    await db.set(`${message.author.id}.banco_coins`, 0)
    await db.set(`${message.author.id}.limite_carteira`, 2000)
    await db.set(`${message.author.id}.nivel`, 1)
    await db.set(`${message.author.id}.xp`, 0)
    await db.set(`${message.author.id}.limite_itens`, 25)
    await db.set(`${message.author.id}.inventario_itens`, [])
    await db.set(`${message.author.id}.arma_equipada`, [])
    await db.set(`${message.author.id}.armadura_equipada`, [])
    await db.set(`${message.author.id}.magias_equipadas`, [])
    await db.set(`${message.author.id}.magias`, [])
    await db.set(`${message.author.id}.armaduras`, [])
    await db.set(`${message.author.id}.armas`, [])

    try {
        await db.set(`${message.author.id}.jornada`, true)
        await message.reply('você começou sua jornada. Boa sorte!')
    }catch(e){
        console.log(e)
    }
}
