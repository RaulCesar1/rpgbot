const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const dbv = require('../index.js')
const db = require('quick.db')

var mf = require(`../utils/idiomas/${dbv.idm}.json`)

const token = cf.token
const botID = cf.botID
var prefix = dbv.prefix

exports.run = async(client, message, args) => {
    if(dbv.manutencao === true) return message.reply(mf["maintenance"])
    if(!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"])

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if(!args[0]) {
        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`Você é nível ${nivel}`, message.author.avatarURL())
        .setDescription(
            `XP atual: **\`${xp}/250\`**\n\n`
           +`XP para o próximo nível: **\`${250 - xp}\`**`
        )

        message.channel.send(message.author, embed)
    }

    if(user) {
        if(user.user.id === message.author.id) {
            message.delete();
            message.reply(`para ver seu nível, use: \`${prefix}nivel\``)   
                .then(msg => {
                    setTimeout(function(){
                        msg.delete()
                    }, 7500)
                })
            return
        }

        let nivel_user = db.fetch(`${user.user.id}.nivel`)
        if(!nivel_user || nivel_user === null || nivel_user === 0 || nivel_user === undefined || isNaN(nivel_user)) {await db.set(`${user.user.id}.nivel`, 1)}
        let xp_user = db.fetch(`${user.user.id}.xp`)
        if(!xp_user || xp_user === null || xp_user === undefined || isNaN(xp_user)) {await db.set(`${user.user.id}.xp`, 0)}

        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`${user.user.username} é nível ${nivel_user}`, user.user.avatarURL())
        .setDescription(
            `XP atual: **\`${xp_user}/250\`**\n\n`
           +`XP para o próximo nível: **\`${250 - xp_user}\`**`
        )

        message.channel.send(message.author, embed)
    }

}
