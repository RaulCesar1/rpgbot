const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')
const msgsFile = require('../utils/configs/messages.json')

exports.run = async(client, message, args) => {
    var coins = db.fetch(`${message.author.id}.coins`)
    var banco_coins = db.fetch(`${message.author.id}.banco_coins`)
    var limite_carteira = db.fetch(`${message.author.id}.limite_carteira`)
    var nivel = db.fetch(`${message.author.id}.nivel`)
    var xp = db.fetch(`${message.author.id}.xp`)
    var limite_itens = db.fetch(`${message.author.id}.limite_itens`)
    var inventario_itens = db.fetch(`${message.author.id}.inventario_itens`)
    var arma_equipada = db.fetch(`${message.author.id}.arma_equipada`)
    var armadura_equipada = db.fetch(`${message.author.id}.armadura_equipada`)
    var magias_equipadas = db.fetch(`${message.author.id}.magias_equipadas`)
    var magias = db.fetch(`${message.author.id}.magias`)
    var armaduras = db.fetch(`${message.author.id}.armaduras`)
    var armas = db.fetch(`${message.author.id}.armas`)
    var jornada = db.fetch(`${message.author.id}.jornada`)
    var manutencao = db.fetch('manutencao')

    if(manutencao === true) return message.reply(msgsFile["bot_manutencao"])
    if(!jornada || jornada === false) return message.reply(msgsFile["jornada_comece"])

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
