const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

exports.run = async(client, message, args) => {
    const coins = db.fetch(`${message.author.id}.coins`)
    const banco_coins = db.fetch(`${message.author.id}.banco_coins`)
    const nivel = db.fetch(`${message.author.id}.nivel`)
    const limite_itens = db.fetch(`${message.author.id}.limite_itens`)
    const inventario_itens = db.fetch(`${message.author.id}.inventario_itens`)
    const xp = db.fetch(`${message.author.id}.xp`)

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
