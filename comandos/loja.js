const { Discord, Client, MessageEmbed } = require('discord.js')
const configFile = require('../utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')

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

    if(!jornada || jornada === false) return message.reply(`para começar sua jornada, use: \`${prefix}comecar\``)

    function confirmar_compra(nome_item, preco_item, tipo_item) {
        let embed = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor(`Confirmação de Compra - ${message.author.username}`, message.author.avatarURL())
        .addField(`Tem certeza que deseja comprar \`${nome_item}\` ?`, `Preço: **\`${preco_item} coins\`**`)
        .setDescription(`:white_check_mark: - Confirmar Compra\n\n:x: - Cancelar Compra`)

        message.channel.send(message.author, embed)
            .then(msg => {
                msg.react('✅'); msg.react('❌')
                
                let f1 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 1})
                let f2 = (r, u) => r.emoji.name === "❌" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 1})

                c1.on('collect', m => {
                    msg.delete()

                    if(coins < preco_item) return message.reply(`você não tem coins suficiente para comprar este item!`)

                    coins -= preco_item

                    db.set(`${message.author.id}.coins`, coins)
                    db.push(`${message.author.id}.${tipo_item}`, `${nome_item}`)
                    db.push(`${message.author.id}.inventario_itens`, `${nome_item}`)

                    message.reply(`compra efetuada com sucesso!`)
                })

                c2.on('collect', m => {
                    msg.delete()
                    message.reply('operação cancelada!').then(mm => {
                        setTimeout(function(){mm.delete()}, 2000)
                    })
                })
            })
    }
    
    confirmar_compra('Fogo Da Fenix', 500, 'magias')
}