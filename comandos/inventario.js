const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

exports.run = async(client, message, args) => {
    const coins = db.fetch(`${message.author.id}.coins`)
    const banco_coins = db.fetch(`${message.author.id}.banco_coins`)
    const nivel = db.fetch(`${message.author.id}.nivel`)
    const limite_itens = db.fetch(`${message.author.id}.limite_itens`)
    const inventario_itens = db.fetch(`${message.author.id}.inventario_itens`)

    if(!args[0]) {
        let embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário`, message.author.avatarURL())
        .setTitle(`Limite do inventário: ${limite_itens} itens.`)
        .setDescription(inventario_itens.length===0?'Você não possui nenhum item!':inventario_itens)
        
        message.reply(embed)
    }   

}
