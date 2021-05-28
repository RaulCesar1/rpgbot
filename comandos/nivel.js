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
    const xp = db.fetch(`${message.author.id}.xp`)

    if(!args[0]) {
        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.username} é nível ${nivel}`, message.author.avatarURL())
        .addField(`XP para o próximo nível: **${5 - xp}**\n\nXP: **${xp}/5**`, `\`Para ganhar XP basta enviar mensagens!\``)

        message.reply(embed)
    }

}
