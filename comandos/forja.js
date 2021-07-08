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

    function no_args() {
        let embed = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(mf["y_shards_title"], message.author.avatarURL())
        .setDescription(mf["y_shards_desc"].replace('SHARDSQ', `\`${dbv.frags}\``))

        message.channel.send(message.author, embed)
        return
    }

    if(args[0] === "fragmentos" || args[0] === "shards") {
        let user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

        if(!args[1]) return no_args()

        if(user) {
            if(user.user.id === message.author.id) return no_args()

            let jornada_user = db.fetch(`${user.user.id}.jornada`)
            let frags_user = db.fetch(`${user.user.id}.frags`)
            if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])
    
            let embed = new MessageEmbed()
            .setColor("YELLOW")
            .setAuthor(``, message.author.avatarURL())
            .setDescription(frags_user===0?mf["forja_3"]:frags_user===1?mf["forja_4"]:mf["forja_2"].replace('{frags_user}', frags_user))
        
            message.channel.send(message.author, embed)
            return
        }
    }

    if(args[0] === "craft" || args[0] === "forjar") {
        let embed = new MessageEmbed()
        .setAuthor(`Forjar item`)
        .setColor("ORANGE")

        message.channel.send(message.author, embed)
    }
}