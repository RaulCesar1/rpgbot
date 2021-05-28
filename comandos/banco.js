const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

exports.run = async(client, message, args) => {
    var coins = db.fetch(`${message.author.id}.coins`)
    var banco_coins = db.fetch(`${message.author.id}.banco_coins`)
    const nivel = db.fetch(`${message.author.id}.nivel`)
    const limite_itens = db.fetch(`${message.author.id}.limite_itens`)
    const inventario_itens = db.fetch(`${message.author.id}.inventario_itens`)

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if(!args[0]) {
        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`${message.author.username} - Conta do Banco`, message.author.avatarURL())
        .setDescription(`Você tem \`${banco_coins} coin(s)\` em sua conta do banco.`)
        .addField('Para sacar esses coins utilize:',
        `\`${prefix}banco sacar "quantidade de coins"\` sem as aspas!`)
        .addField('Para guardar coins utilize:',
        `\`${prefix}banco depositar "quantidade de coins"\` sem as aspas!`)

        let embed1 = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Sua conta do banco`, message.author.avatarURL())
        .setDescription(`**Você não tem nenhum coin na sua conta do banco! :(**`)

        message.channel.send(message.author, banco_coins===0?embed1:embed)
    }

    if(args[0] === "depositar") {
        if(!args[1]) return message.reply(`use: \`${prefix}banco depositar "quantidade de coins"\` sem as aspas!`)
        if(isNaN(args[1])) return message.reply(`o valor inserido precisa ser um número!`)
        if(args[1] <= 0) return message.reply(`o valor inserido precisa ser no mínimo **1**!`)
        if(args[1] > coins) return message.reply(`você não tem coins suficiente em sua carteira para depositar!`)

        let coins_depositados = parseInt(args[1], 10)

        coins -= coins_depositados
        banco_coins += coins_depositados

        db.set(`${message.author.id}.coins`, coins)
        db.set(`${message.author.id}.banco_coins`, banco_coins)

        message.reply(coins_depositados===1?`operação realizada com sucesso! **${args[1]} coin** foi depositado em sua conta no banco.`:`operação realizada com sucesso! **${args[1]} coins** foram depositados em sua conta no banco.`)
    }

    if(args[0] === "sacar") {
        if(!args[1]) return message.reply(`use: \`${prefix}banco sacar "quantidade de coins"\` sem as aspas!`)
        if(isNaN(args[1])) return message.reply(`o valor inserido precisa ser um número!`)
        if(args[1] <= 0) return message.reply(`o valor inserido precisa ser no mínimo **1**!`)
        if(args[1] > banco_coins) return message.reply(`você não tem coins suficiente para sacar!`)

        let coins_sacados = parseInt(args[1], 10)

        coins += coins_sacados
        banco_coins -= coins_sacados

        db.set(`${message.author.id}.coins`, coins)
        db.set(`${message.author.id}.banco_coins`, banco_coins)

        message.reply(coins_sacados===1?`operação realizada com sucesso! **${args[1]} coin** foi adicionado em sua carteira.`:`operação realizada com sucesso! **${args[1]} coins** foram adicionados em sua carteira.`)
    }


}