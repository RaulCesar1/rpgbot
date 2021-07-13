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
    
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(mf["noperm"])
    if(!args[0]) return message.reply(mf["prefix_cmd_no_args"].replace('$prefix', prefix))

    let av = ['definir', 'set', 'reset', 'resetar']

    if(av.indexOf(args[0]) === -1) return message.reply(mf["prefix_cmd_no_args"].replace('$prefix', prefix))

    if(args[0] === "definir" || args[0] === "set") {
        if(!args[1] || args[1].length === 0) return message.reply(mf["prefix_cmd_no_args_2"].replace('$set', args[0]).replace('$prefix', prefix))
        if(args[1].length > 3) return message.reply(mf["prefix_cmd_m3"])
        if(args[1] === prefix) return message.reply(mf["prefix_in_use"])

        try {
            await db.set(`${message.guild.id}.prefix`, args[1])
            prefix = await db.fetch(`${message.guild.id}.prefix`)
            await message.reply(mf["prefix_cmd_defined"].replace('{prefix}', prefix))
        }catch(e) {
            console.log(e)
        }
        return
    }

    if(args[0] === "resetar" || args[0] === "reset") {
        try {
            await db.set(`${message.guild.id}.prefix`, 'r!')
            prefix = await db.fetch(`${message.guild.id}.prefix`)
            await message.reply(mf["prefix_cmd_reset"])
        }catch(e){
            console.log(e)
        }
        return
    }
}