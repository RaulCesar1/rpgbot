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
        .setColor("RED")
        .setAuthor(mf["nivel_1"].replace('{nivel}', dbv.nivel), message.author.avatarURL())
        .setDescription(
            mf["nivel_2"].replace('{xp}', dbv.xp) + "\n"
           +mf["nivel_3"].replace('{calc}', dbv.up_xp - dbv.xp)
        )

        message.channel.send(message.author, embed)
        return
    }

    if(!args[0]) return no_args()

    if(user) {
        if(user.user.id === message.author.id) return no_args()

        let nivel_user = db.fetch(`${user.user.id}.nivel`)
        let xp_user = db.fetch(`${user.user.id}.xp`)
        let up_xp_user = db.fetch(`${user.user.id}.up_xp`)
        let jornada_user = db.fetch(`${user.user.id}.jornada`)
        if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])

        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(mf["nivel_4"].replace('{nivel_user}', nivel_user).replace('{user.user.username}', user.user.username), user.user.avatarURL())
        .setDescription(
            mf["nivel_2"].replace('{xp}', xp_user) + "\n"
           +mf["nivel_3"].replace('{calc}', up_xp_user - xp_user)
        )

        message.channel.send(message.author, embed)
    }

}
