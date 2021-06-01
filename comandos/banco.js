const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')
const msgsFile = require('../utils/configs/messages.json')

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
    var manutencao = db.fetch('manutencao')

    if(manutencao === true) return message.reply(msgsFile["bot_manutencao"])
    if(!jornada || jornada === false) return message.reply(msgsFile["jornada_comece"])

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if(!args[0]) {
        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Sua conta do banco`, message.author.avatarURL())
        .setDescription(banco_coins===0?`**Você não tem nenhum coin na sua conta do banco.**`:banco_coins===1?`**Você tem \`${banco_coins} coin\` na sua conta do banco.**`:`**Você tem \`${banco_coins} coins\` na sua conta do banco.**`)

        let embedTips = new MessageEmbed()
        .setColor("GREEN")
        .addField('Para sacar coins utilize:',
        `\`${prefix}banco sacar "quantidade de coins"\` sem as aspas!`)
        .addField('Para depositar coins utilize:',
        `\`${prefix}banco depositar "quantidade de coins"\` sem as aspas!`)

        message.channel.send(message.author, embed)
            .then(msg => {
                var qual = false;
                msg.react('❗')

                let f1 = (r, u) => r.emoji.name === "❗" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 100})

                c1.on('collect', m => {
                    msg.reactions.resolve('❗').users.remove(message.author.id)
                    if(qual === false) {
                        qual = true;
                        msg.edit(embedTips)
                    } else {
                        qual = false;
                        msg.edit(embed)
                    }
                })
            })
    }

    if(args[0] === "depositar") {
        let coins_depositados = parseInt(args[1], 10)

        if(!args[1]) return message.reply(`use: \`${prefix}banco depositar "quantidade de coins"\` sem as aspas!`)
        if(args[1] === "max" || args[1] === "maximo" || args[1] === "all") {
            let maxDeposito = coins

            if(maxDeposito === 0) return message.reply(`esta operação não pode ser realizada! Motivo: **você não tem nenhum coin para depositar!**`)

            coins -= maxDeposito
            banco_coins += maxDeposito
    
            db.set(`${message.author.id}.coins`, coins)
            db.set(`${message.author.id}.banco_coins`, banco_coins)
    
            message.reply(maxDeposito===1?`operação realizada com sucesso! **${maxDeposito} coin** foi depositado em sua conta no banco.`:`operação realizada com sucesso! **${maxDeposito} coins** foram depositados em sua conta no banco.`)
            return
        }
        if(isNaN(args[1])) return message.reply(`o valor inserido precisa ser um número!`)
        if(args[1] <= 0) return message.reply(`o valor inserido precisa ser no mínimo **1**!`)
        if(args[1] > coins) return message.reply(`você não tem coins suficiente em sua carteira para depositar!`)

        coins -= coins_depositados
        banco_coins += coins_depositados

        db.set(`${message.author.id}.coins`, coins)
        db.set(`${message.author.id}.banco_coins`, banco_coins)

        message.reply(coins_depositados===1?`operação realizada com sucesso! **${args[1]} coin** foi depositado em sua conta no banco.`:`operação realizada com sucesso! **${args[1]} coins** foram depositados em sua conta no banco.`)
    }

    if(args[0] === "sacar") {
        let coins_sacados = parseInt(args[1], 10)

        if(!args[1]) return message.reply(`use: \`${prefix}banco sacar "quantidade de coins"\` sem as aspas!`)
        if(args[1] === "max" || args[1] === "maximo" || args[1] === "all") {
            let saqueMaximo = limite_carteira - coins
            var saqueTotalMaximo;
            saqueMaximo>banco_coins?saqueTotalMaximo=banco_coins:saqueMaximo<banco_coins?saqueTotalMaximo=saqueMaximo:saqueTotalMaximo=saqueMaximo

            if(saqueTotalMaximo === 0) return message.reply(`esta operação não pode ser realizada! Motivo: **você não tem nenhum coin para sacar!**`)

            coins += saqueTotalMaximo
            banco_coins -= saqueTotalMaximo

            db.set(`${message.author.id}.coins`, coins)
            db.set(`${message.author.id}.banco_coins`, banco_coins)

            message.reply(saqueTotalMaximo===1?`operação realizada com sucesso! **${saqueTotalMaximo} coin** foi adicionado em sua carteira.`:`operação realizada com sucesso! **${saqueTotalMaximo} coins** foram adicionados em sua carteira.`)
            return
        }
        if(isNaN(args[1])) return message.reply(`o valor inserido precisa ser um número!`)
        if(args[1] <= 0) return message.reply(`o valor inserido precisa ser no mínimo **1**!`)
        if(args[1] > banco_coins) return message.reply(`você não tem coins suficiente para sacar!`)
        let saqueVerificar = coins_sacados + coins
        if(saqueVerificar > limite_carteira) return message.reply(`esta operação não pode ser realizada! Motivo: **o valor retirado ultrapassaria o limite da carteira.**`)

        coins += coins_sacados
        banco_coins -= coins_sacados

        db.set(`${message.author.id}.coins`, coins)
        db.set(`${message.author.id}.banco_coins`, banco_coins)

        message.reply(coins_sacados===1?`operação realizada com sucesso! **${args[1]} coin** foi adicionado em sua carteira.`:`operação realizada com sucesso! **${args[1]} coins** foram adicionados em sua carteira.`)
    }

    if(user) {
        if(user.user.id === message.author.id) {
            message.delete();
            message.reply(`para ver quantos coins você tem na sua conta do banco, use: \`${prefix}banco\``)   
                .then(msg => {
                    setTimeout(function(){
                        msg.delete()
                    }, 7500)
                })
            return
        }

        let banco_coins_user = db.fetch(`${user.user.id}.banco_coins`)
        if(!banco_coins_user || banco_coins_user===null || banco_coins_user === undefined) {await db.set(`${user.user.id}.banco_coins`, 0)}

        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Conta do banco de ${user.user.username}`, user.user.avatarURL())
        .setDescription(banco_coins_user===0?`**Ele não tem nenhum coin na conta do banco.**`:banco_coins_user===1?`**Ele tem \`${banco_coins_user} coin\` na conta do banco.**`:`**Ele tem \`${banco_coins_user} coins\` na conta do banco.**`)
    
        message.channel.send(message.author, embed)
        return
    }
}