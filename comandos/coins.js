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
    const limite_carteira = db.fetch(`${message.author.id}.limite_carteira`)

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if(!args[0]) {
        let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Sua carteira`, message.author.avatarURL())
        .setTitle(`Limite da carteira: **${limite_carteira} coins**`)
        .setDescription(`Você tem \`${coins} coin(s)\` na sua carteira. ${coins===limite_carteira?`\n**limite da carteira atingido! Para aumentar o limite use: \`${prefix}loja\`**`:''}`)
        .addField('Para utilizar o banco use:',
                  `\`${prefix}banco\``)

        let embed1 = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Sua carteira`, message.author.avatarURL())
        .setTitle(`Limite da carteira: **${limite_carteira} coins**`)
        .setDescription(`**Você não tem nenhum coin! :(**`)
    
        message.channel.send(message.author, coins===0?embed1:embed)
    }

    if(user) {
        let userCoins = db.fetch(`${user.user.id}.coins`)
        if(!userCoins || userCoins===null) {await db.set(`${user.user.id}.coins`, 0)}

        let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Carteira de ${user.user.username}`, user.user.avatarURL())
        .setDescription(`Ele tem \`${userCoins} coin(s)\` em sua carteira.`)

        let embed1 = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Carteira de ${user.user.username}`, user.user.avatarURL())
        .setDescription(`**Ele não tem nenhum coin! :(**`)
    
        message.channel.send(message.author, userCoins===0?embed1:embed)
    }

}