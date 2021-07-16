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

    let embed_configs = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`Configurações de ${message.author.username}`, message.author.avatarURL())
    .addField(`Menções`, dbv.mentions===true?`\`Ativadas\` :green_circle:`:`\`Desativadas\` :red_circle:`, true)
    .addField(`Idioma`, `\`${dbv.idm.toUpperCase()}\``, true)

    message.channel.send(dbv.mentions===true?message.author:'', embed_configs)
    .then(msg => {
        msg.react('865627808276283452')

        let f1 = (r, u) => r.emoji.name === "ping" && u.id === message.author.id;
        let c1 = msg.createReactionCollector(f1, {max: 1})

        c1.on('collect', mm => {
            message.delete()
            msg.delete()
            message.channel.send(dbv.mentions===true?`${message.author.username}, menções desativadas.`:`${message.author}, menções ativadas.`)
            db.set(`${message.author.id}.mentions`, dbv.mentions===true?false:true)
        })
    })
}