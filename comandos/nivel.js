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
        .setAuthor(`Você é nível ${nivel}`, message.author.avatarURL())
        .setDescription(
            `XP atual: **\`${xp}/250\`**\n\n`
           +`XP para o próximo nível: **\`${250 - xp}\`**`
        )

        message.channel.send(message.author, embed)
    }

}
