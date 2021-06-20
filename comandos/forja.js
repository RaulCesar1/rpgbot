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

    if(args[0] === "fragmentos" || args[0] === "shards") {
        let user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

        if(!args[1]) {
            let embed = new MessageEmbed()
            .setColor("YELLOW")
            .setAuthor(mf["y_shards_title"], message.author.avatarURL())
            .setDescription(mf["y_shards_desc"].replace('SHARDSQ', `\`${dbv.frags}\``))

            message.channel.send(message.author, embed)
        }

        if(user) {
            if(user.user.id === message.author.id) return message.reply(mf["see_y_frags"].replace('PREFIX', prefix))
        }
    }
}