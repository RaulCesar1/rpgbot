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

    const IDMS = [
        "EN",
        "PT"
    ]

    if(!args[0]) return message.reply(mf["idm_1"].replace('{prefix}', prefix))

    if(args[0] === "set" || args[0] === "definir") {

        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(mf["noperm"])

        if(!args[1]) return message.reply(mf["idm_set_noargs1"].replace('PREFIX', prefix).replace('args1', args[0]))

        if(IDMS.indexOf(args[1].toUpperCase()) === -1) return message.reply(mf["un_idm"].replace('$idioma', args[1].toLowerCase().slice(0, 3)).replace('$prefix', prefix))

        if(args[1].toLowerCase() === dbv.idm) return message.reply(mf["using"])

        try {

            await db.set(`${message.guild.id}.idm`, args[1].toLowerCase())

            dbv.idm = await db.fetch(`${message.guild.id}.idm`)
            mf = require(`../utils/idiomas/${dbv.idm}.json`)

            await message.reply(`${mf["idm_def"]}`)

        } catch(e) {
            console.log(e)
        }

        return
    }

    if(args[0] === "lista" || args[0] === "list") {

        let embed = new MessageEmbed()
        .setColor("AQUA")
        .setAuthor(mf["list_title"], client.user.avatarURL())
        .setDescription(IDMS)

        message.channel.send(message.author, embed)
    }
}