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

    if(!args[0]) return message.reply(`use: \`${prefix}jornada "comecar/reiniciar"\` sem as aspas!`)

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
    
        try {
            await db.set(`${message.author.id}.jornada`, true)
            await message.reply('você começou sua jornada. Boa sorte!')
        }catch(e){
            console.log(e)
        }
    }

    if(args[0] === "reiniciar") {
        if(!jornada) return message.reply(`você ainda não começou sua jornada!`)

        let embedConfirmacao = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`Tem certeza que deseja reiniciar sua jornada?`, message.author.avatarURL())

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
                    message.reply('operação cancelada!')
                        .then(mm => setTimeout(() => mm.delete(), 4000))
                })
            })
    }

    if(args[0] === "comecar") {
        if(jornada === true) return message.reply(`você já começou sua jornada! Caso queira reiniciar, use: \`${prefix}jornada reiniciar\``)
        setar()
    }
}
