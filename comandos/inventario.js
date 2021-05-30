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

    var arma_equipada = db.fetch(`${message.author.id}.arma_equipada`)
    var armadura_equipada = db.fetch(`${message.author.id}.armadura_equipada`)
    var magias_equipadas = db.fetch(`${message.author.id}.magias_equipadas`)

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if(!args[0]) {
        let embedPrincipal = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário`, message.author.avatarURL())
        .addField(`Arma Equipada:`, arma_equipada.length===0?'Você não equipou nenhuma arma ainda!':arma_equipada)
        .addField(`Armadura Equipada:`, armadura_equipada.length===0?'Você não equipou nenhuma armadura ainda!':armadura_equipada)
        .addField(`Magias Equipadas:`, magias_equipadas.length===0?'Você não equipou nenhuma magia ainda!':magias_equipadas)

        let embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário`, message.author.avatarURL())
        .setDescription(inventario_itens.length===0?'**Você não possui nenhum item!**':inventario_itens)
        
        let embedTips = new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`**Limite do inventário: \`${limite_itens} itens\`**`)
    
        message.channel.send(message.author, embedPrincipal)
            .then(msg => {
                msg.react('✅'); msg.react('💼'); msg.react('❗');

                let f1 = (r, u) => r.emoji.name === "❗" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 100})
                let f2 = (r, u) => r.emoji.name === "💼" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 100})
                let f3 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c3 = msg.createReactionCollector(f3, {max: 100})

                c1.on('collect', m => {
                    msg.reactions.resolve('❗').users.remove(message.author.id)
                    msg.edit(embedTips)
                })

                c2.on('collect', m => {
                    msg.reactions.resolve('💼').users.remove(message.author.id)
                    msg.edit(embed)
                })
            
                c3.on('collect', m => {
                    msg.reactions.resolve('✅').users.remove(message.author.id)
                    msg.edit(embedPrincipal)
                })
            })

        return
    }
    
    if(args[0] === "equipar") {
        
    }

    if(user) {
        if(user.user.id === message.author.id) {
            message.delete();
            message.reply(`para ver seu próprio inventário, use: \`${prefix}inventario\``)   
                .then(msg => {
                    setTimeout(function(){
                        msg.delete()
                    }, 7500)
                })
            return
        }

        let inventario_itens_user = db.fetch(`${user.user.id}.inventario_itens`)
        if(!inventario_itens_user || inventario_itens_user === null || inventario_itens_user === 0) {await db.set(`${user.user.id}.inventario_itens`, [])}

        let embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Inventário de: ${user.user.username}`, user.user.avatarURL())
        .setDescription(inventario_itens_user.length===0?'**Este usuário não possui nenhum item!**':inventario_itens_user)

        message.channel.send(message.author, embed)

        return
    }

}
