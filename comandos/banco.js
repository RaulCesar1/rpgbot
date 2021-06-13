const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const dbv = require('../index.js')
const db = require('quick.db')

var mf = require(`../utils/idiomas/${dbv.idm}.json`)

const token = cf.token
const botID = cf.botID
var prefix = dbv.prefix

exports.run = async(client, message, args, comando) => {
    if(dbv.manutencao === true) return message.reply(mf["maintenance"])
    if(!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"].replace('PREFIX', prefix))

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    function no_args() {
        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(mf["banco_1"], message.author.avatarURL())
        .setDescription(dbv.banco_coins===0?mf["banco_4"]:dbv.banco_coins===1?mf["banco_5"]:mf["banco_6"].replace('{banco_coins}', dbv.banco_coins))

        let embedTips = new MessageEmbed()
        .setColor("GREEN")
        .addField(mf["banco_2"],
        mf["banco_3"].replace('{prefix}', prefix))
        .addField(mf["banco_23"],
        mf["banco_24"].replace('{prefix}', prefix))

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

    if(!args[0]) return no_args()

    if(args[0] === "depositar" || args[0] === "deposit") {
        let coins_depositados = parseInt(args[1], 10)

        if(!args[1]) return message.reply(mf["banco_7"].replace('{prefix}', prefix))
        if(args[1] === "max" || args[1] === "maximo" || args[1] === "all") {
            let maxDeposito = dbv.coins

            if(maxDeposito === 0) return message.reply(mf["banco_8"])

            dbv.coins -= maxDeposito
            dbv.banco_coins += maxDeposito
    
            db.set(`${message.author.id}.coins`, dbv.coins)
            db.set(`${message.author.id}.banco_coins`, dbv.banco_coins)
    
            message.reply(maxDeposito===1?mf["banco_9"]:mf["banco_10"].replace('{banco_coins}', maxDeposito))
            return
        }
        if(isNaN(args[1])) return message.reply(mf["banco_11"])
        if(args[1] <= 0) return message.reply(mf["banco_12"])
        if(args[1] > coins) return message.reply(mf["banco_13"])

        dbv.coins -= coins_depositados
        dbv.banco_coins += coins_depositados

        db.set(`${message.author.id}.coins`, dbv.coins)
        db.set(`${message.author.id}.banco_coins`, dbv.banco_coins)

        message.reply(coins_depositados===1?mf["banco_14"]:mf["banco_15"].replace('{banco_coins}', args[1]))
    }

    if(args[0] === "sacar" || args[0] === "withdraw") {
        let coins_sacados = parseInt(args[1], 10)

        if(!args[1]) return message.reply(mf["banco_30"].replace('{prefix}', prefix))
        if(args[1] === "max" || args[1] === "maximo" || args[1] === "all") {
            let saqueMaximo = limite_carteira - dbv.coins
            var saqueTotalMaximo;
            saqueMaximo>dbv.banco_coins?saqueTotalMaximo=dbv.banco_coins:saqueMaximo<dbv.banco_coins?saqueTotalMaximo=saqueMaximo:saqueTotalMaximo=saqueMaximo

            if(saqueTotalMaximo === 0) return message.reply(mf["banco_16"])

            dbv.coins += saqueTotalMaximo
            dbv.banco_coins -= saqueTotalMaximo

            db.set(`${message.author.id}.coins`, dbv.coins)
            db.set(`${message.author.id}.banco_coins`, dbv.banco_coins)

            message.reply(saqueTotalMaximo===1?mf["banco_17"]:mf["banco_18"].replace('{saqueTotalMaximo}', saqueTotalMaximo))
            return
        }
        if(isNaN(args[1])) return message.reply(mf["banco_11"])
        if(args[1] <= 0) return message.reply(mf["banco_12"])
        if(args[1] > dbv.banco_coins) return message.reply(mf["banco_19"])
        let saqueVerificar = coins_sacados + dbv.coins
        if(saqueVerificar > limite_carteira) return message.reply(mf["banco_20"])

        dbv.coins += coins_sacados
        dbv.banco_coins -= coins_sacados

        db.set(`${message.author.id}.coins`, dbv.coins)
        db.set(`${message.author.id}.banco_coins`, dbv.banco_coins)

        message.reply(coins_sacados===1?mf["banco_21"]:mf["banco_22"].replace('args1', args[1]))
    }

    if(user) {
        if(user.user.id === message.author.id) return no_args()

        let jornada_user = db.fetch(`${user.user.id}.jornada`)
        let banco_coins_user = db.fetch(`${user.user.id}.banco_coins`)
        if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])

        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(mf["banco_26"].replace('{user.user.username}', user.user.username), user.user.avatarURL())
        .setDescription(banco_coins_user===0?mf["banco_27"]:banco_coins_user===1?mf["banco_28"]:mf["banco_29"].replace('{banco_coins_user}', banco_coins_user))
    
        message.channel.send(message.author, embed)
        return
    }
}