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

    const jornada_porcentagem = Math.floor((dbv.nivel * 100) / dbv.max_level)

    function no_args() {
        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`Você é nível ${dbv.nivel}`, message.author.avatarURL())
        .setDescription(
            `XP atual: **\`${dbv.xp}\`**\n`
           +`XP para o próximo nível: **\`${dbv.up_xp - dbv.xp}\`**\n\n`
           +`Sua jornada está ${jornada_porcentagem}% concluída!`
        )

        message.channel.send(message.author, embed)
        return
    }

    if(!args[0]) return no_args()

    if(user) {
        if(user.user.id === message.author.id) return no_args()

        let nivel_user = db.fetch(`${user.user.id}.nivel`)
        let xp_user = db.fetch(`${user.user.id}.xp`)
        let jornada_user = db.fetch(`${user.user.id}.jornada`)
        if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])

        let jornada_porcentagem_user = Math.floor((nivel_user * 100) / dbv.max_level)

        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`${user.user.username} é nível ${nivel_user}`, user.user.avatarURL())
        .setDescription(
            `XP atual: **\`${xp_user}\`**\n`
           +`XP para o próximo nível: **\`${dbv.up_xp - xp_user}\`**\n\n`
           +`A jornada dele está ${jornada_porcentagem_user}% concluída!`
        )

        message.channel.send(message.author, embed)
    }

}
