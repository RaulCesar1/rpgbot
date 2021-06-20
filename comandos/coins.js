const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const db = require('quick.db')

const token = cf.token
const botID = cf.botID

exports.run = async(client, message, args) => {
    const dbv = require('../index.js')
    var mf = require(`../utils/idiomas/${dbv.idm}.json`)
    var prefix = dbv.prefix
    
    if(dbv.manutencao === true) return message.reply(mf["maintenance"])
    if(!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"].replace('PREFIX', prefix))

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    function no_args() {
        let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(mf["coins_1"], message.author.avatarURL())
        .setDescription(dbv.coins===0?mf["coins_2"]:dbv.coins===1?mf["coins_3"]:mf["coins_4"].replace('{coins}', dbv.coins))

        let embedTips = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription(mf["coins_5"].replace('{limite_carteira}', dbv.limite_carteira))
        .addField(mf["coins_6"],
        mf["coins_7"].replace('{prefix}', prefix))
    
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
        return
    }

    if(!args[0]) return no_args()

    if(args[0] === "enviar" || args[0] === "send") {
        let quantidadeCoins = parseInt(args[2], 10)

        if(!args[1]) return message.reply(mf["coins_12"].replace('{prefix}', prefix))
        let jornada_user = db.fetch(`${user.user.id}.jornada`)
        if(user.user.bot) return;
        if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])
        if(user.user.id === message.author.id) {
            message.delete();
            message.reply(mf["coins_13"])   
                .then(msg => {
                    setTimeout(function(){
                        msg.delete()
                    }, 7500)
                })
            return
        }

        let limite_carteira_user = db.fetch(`${user.user.id}.limite_carteira`)
        var coins_user = db.fetch(`${user.user.id}.coins`)

        let quantidadeCoinsVerificar = quantidadeCoins + coins_user

        if(!args[2]) return message.reply(mf["coins_12"].replace('{prefix}', prefix))
        if(isNaN(args[2])) return message.reply(mf["coins_14"])
        if(args[2] <= 0) return message.reply(mf["coins_15"])
        if(quantidadeCoins > dbv.coins) return message.reply(mf["coins_16"])
        if(quantidadeCoinsVerificar > limite_carteira_user) return message.reply(mf["coins_17"])

        dbv.coins -= quantidadeCoins
        coins_user += quantidadeCoins

        db.set(`${message.author.id}.coins`, dbv.coins)
        db.set(`${user.user.id}.coins`, coins_user)

        message.reply(quantidadeCoins===1?mf["coins_18"].replace('{user.user.username}', user.user.username):mf["coins_19"].replace('{quantidadeCoins}', quantidadeCoins).replace('{user.user.username}', user.user.username))

        return
    }

    if(user) {
        if(user.user.id === message.author.id) return no_args()

        let jornada_user = db.fetch(`${user.user.id}.jornada`)
        let userCoins = db.fetch(`${user.user.id}.coins`)
        if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])

        let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(mf["coins_8"].replace('{user.user.username}', user.user.username), user.user.avatarURL())
        .setDescription(userCoins===0?mf["coins_9"]:userCoins===1?mf["coins_10"]:mf["coins_11"].replace('{userCoins}', userCoins))
    
        message.channel.send(message.author, embed)
        return
    }

}