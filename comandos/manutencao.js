const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')
const msgsFile = require('../utils/configs/messages.json')

exports.run = async(client, message, args) => {
    var manutencao = db.fetch('manutencao')

    if(!args[0]) return message.reply(`manutenção: \`${manutencao===false?'OFF':'ON'}\``)
    if(args[0] === "." || args[0] === "r") {
        if(message.author.id !== "693929568020725843") {
            message.delete()
            message.reply('sem permissão!').then(msg => {
                setTimeout(() => msg.delete(), 2000)
            })
            return
        }
        manutencao===false?db.set('manutencao', true):db.set('manutencao', false)
        manutencao = db.fetch('manutencao')
        message.delete()
        message.reply(`ok! **${manutencao}**`).then(msg => {
            setTimeout(() => msg.delete(), 800);
        })
    }

}
