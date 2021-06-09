const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const dbv = require('../index.js')
const db = require('quick.db')

var mf = require('../utils/configs/messages.json')
mf = mf[dbv.idm]

const token = cf.token
const botID = cf.botID
const prefix = cf.prefix

exports.run = async(client, message, args) => {
    if(dbv.manutencao === true) return message.reply(mf["geral"]["maintenance"])

    if(!args[0]) return message.reply(mf["commands"]["jornada"]["st/rs"].replace('PREFIX', prefix))

    async function setar() {
        await db.set(`${message.author.id}.coins`, 0)
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
        await db.set(`${message.author.id}.frags`, 0)

        try {
            await db.set(`${message.author.id}.jornada`, true)
            await message.reply(mf["commands"]["jornada"]["GL"])
        }catch(e){
            console.log(e)
        }
    }

    if(args[0] === "reiniciar" || args[0] === "restart") {
        //if(dbv.nivel < 5) return message.reply(mf["commands"]["jornada"]["min_level"])

        let embedConfirmacao = new MessageEmbed()
        .setColor("RED")
        .setAuthor(mf["commands"]["jornada"]["sure?"], message.author.avatarURL())

        message.channel.send(message.author, embedConfirmacao)
            .then(msg => {
                msg.react('✅'); msg.react('❌')

                let f1 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 1})
                let f2 = (r, u) => r.emoji.name === "❌" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 1})

                c1.on('collect', m => {
                    message.delete()
                    msg.delete()
                    setar()
                })

                c2.on('collect', m => {
                    message.delete()
                    msg.delete()
                    message.reply(mf["geral"]["op_cancel"])
                        .then(mm => setTimeout(() => mm.delete(), 4000))
                })
            })
    }

    if(args[0] === "comecar" || args[0] === "start") {
        if(jornada === true) return message.reply()
        setar()
    }
}
