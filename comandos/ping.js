const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

exports.run = async(client, message, args) => {
    const embed = new MessageEmbed()
    .setTimestamp()
    .setColor('YELLOW')
    .setAuthor(`${client.user.username} - Comando de Ping!`, client.user.avatarURL())
    .addField(`Ping do BOT:`, `**${client.ws.ping}ms**`)

    db.set(`${message.author.id}.coins`, 2000)

    message.reply(embed);
}