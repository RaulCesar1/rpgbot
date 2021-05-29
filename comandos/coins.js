const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

exports.run = async(client, message, args) => {
    var coins = db.fetch(`${message.author.id}.coins`)
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
        .setDescription(coins===1?`Você tem \`${coins} coin\` na sua carteira.`:`Você tem \`${coins} coins\` na sua carteira.`)

        let embed1 = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Sua carteira`, message.author.avatarURL())
        .setDescription(`**Você não tem nenhum coin na sua carteira.**`)

        let embedTips = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription(`**Limite da carteira: \`${limite_carteira} coins\`**`)
        .addField('Para enviar coins para outros usuários utilize:',
        `\`${prefix}coins enviar "usuário" "quantidade de coins"\` sem as aspas!`)
        .addField('Para depositar coins na conta do banco utilize:',
        `\`${prefix}banco depositar "quantidade de coins"\` sem as aspas!`)
    
        message.channel.send(message.author, coins===0?embed1:embed)
            .then(msg => {
                var qual = false;
                msg.react('❗')

                let f1 = (r, u) => r.emoji.name === "❗" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 100})

                c1.on('collect', m => {
                    msg.reactions.resolve('❗').users.remove(message.author.id)
                    if(qual === false) {
                        qual = true;
                        msg.edit(embedTips)
                    } else {
                        qual = false;
                        msg.edit(coins===0?embed1:embed)
                    }
                })
            })
        return
    }

    if(args[0] === "enviar") {
        let limite_carteira_user = db.fetch(`${user.user.id}.limite_carteira`)
        if(!limite_carteira_user || limite_carteira_user === null || limite_carteira_user === 0) {await db.set(`${user.user.id}.limite_carteira`, 2000)}
        var coins_user = db.fetch(`${user.user.id}.coins`)
        if(!coins_user || coins_user===null) {await db.set(`${user.user.id}.coins`, 0)}

        let quantidadeCoins = parseInt(args[2], 10)

        let quantidadeCoinsVerificar = quantidadeCoins + coins_user

        if(!args[1]) return message.reply(`use: \`${prefix}coins enviar "usuário" "quantidade de coins"\` sem as aspas!`)
        if(!args[2]) return message.reply(`use: \`${prefix}coins enviar "usuário" "quantidade de coins"\` sem as aspas!`)
        if(isNaN(args[2])) return message.reply(`a quantidade de coins precisa ser um número!`)
        if(args[2] <= 0) return message.reply(`a quantidade de coins precisa ser no mínimo **1!**`)
        if(quantidadeCoins > coins) return message.reply(`você não tem a quantidade de coins suficiente para enviar!`)
        if(quantidadeCoinsVerificar > limite_carteira_user) return message.reply(`esta operação não pode ser realizada! Motivo: **o valor enviado ultrapassaria o limite da carteira do usuário.**`)

        coins -= quantidadeCoins
        coins_user += quantidadeCoins

        db.set(`${message.author.id}.coins`, coins)
        db.set(`${user.user.id}.coins`, coins_user)

        message.reply(quantidadeCoins===1?`coin enviado com sucesso! **${quantidadeCoins} coin** foi enviado para ${user.user.username}`:`coins enviados com sucesso! **${quantidadeCoins} coins** foram enviados para ${user.user.username}`)

        return
    }

    if(user) {
        if(user.user.id === message.author.id) {
            message.delete();
            message.reply(`para ver quantos coins você tem na sua carteira, use: \`${prefix}coins\``)   
                .then(msg => {
                    setTimeout(function(){
                        msg.delete()
                    }, 7500)
                })
            return
        }

        let userCoins = db.fetch(`${user.user.id}.coins`)
        if(!userCoins || userCoins===null) {await db.set(`${user.user.id}.coins`, 0)}

        let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Carteira de ${user.user.username}`, user.user.avatarURL())
        .setDescription(userCoins===1?`Ele tem \`${userCoins} coin\` na carteira.`:`Ele tem \`${userCoins} coins\` na carteira.`)

        let embed1 = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Carteira de ${user.user.username}`, user.user.avatarURL())
        .setDescription(`**Ele não tem nenhum coin na carteira.**`)
    
        message.channel.send(message.author, userCoins===0?embed1:embed)
        return
    }

}