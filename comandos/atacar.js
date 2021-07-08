const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const db = require('quick.db')

const token = cf.token
const botID = cf.botID

exports.run = async(client, message, args, comando) => {
    const dbv = require('../index.js')
    var mf = require(`../utils/idiomas/${dbv.idm}.json`)
    var prefix = dbv.prefix
    
    if(dbv.manutencao === true) return message.reply(mf["maintenance"])
    if(!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"].replace('PREFIX', prefix))

    function atacar(vida, atacado, me) {
        let embed = new MessageEmbed()
        .setAuthor("Você está atacando um monstro!")
        .addField("Vida:", `${vida} HP`)
        .setColor("AQUA")   

        atacado===false?message.delete():''
        atacado===false?me=message.channel.send(message.author, embed):me=me

        atacado===true?me.edit(embed):""
        me.then(msg => {
            msg.react('⚔️')
            msg.react('🔥')

            let f1 = (r, u) => r.emoji.name === "⚔️" && u.id === message.author.id;
            let c1 = msg.createReactionCollector(f1, {max: 1})
            let f2 = (r, u) => r.emoji.name === "🔥" && u.id === message.author.id;
            let c2 = msg.createReactionCollector(f2, {max: 1})

            c1.on('collect', mm => {
                let dano = Math.floor(Math.random() * 30)
                vida -= dano

                msg.delete()

                if(vida <= 0) return message.reply(`você deu \`${dano}\` de dano no monstro e ele morreu! Parabéns!`)
                
                return atacar(vida, true, msg)
            })

            c2.on('collect', mm => {
                msg.delete()
                message.reply('magias em desenvolvimento!')
                return
            })
        })
    }

    if(!args[0]) return atacar(200, false, {})
}