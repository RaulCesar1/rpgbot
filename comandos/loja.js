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

    function confirmar_compra(nome_item, preco_item) {
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
                    coins -= preco_item
                    db.set(`${message.author.id}.coins`, coins)
                    db.push(`${message.author.id}.inventario_itens`, nome_item)
                    message.reply(`compra efetuada com sucesso! Use: \`${prefix}inventario\``)
                })

                c2.on('collect', m => {
                    msg.delete()
                    message.reply('operação cancelada!').then(mm => {
                        setTimeout(function(){mm.delete()}, 2000)
                    })
                })
            })
    }

    function pagina_armas_1() {
        let embed = new MessageEmbed()
        .setDescription(`:one: - Espada Goblin - 350 coins`)
        .setFooter("Clique em um dos emojis abaixo para selecionar o item.")

        message.channel.send(message.author, embed)
            .then(msg => {
                msg.react('1️⃣');msg.react('🏠');msg.react('▶')

                let f1 = (r, u) => r.emoji.name === "1️⃣" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 1})

                c1.on('collect', m => {
                    msg.delete()
                    message.delete()
                    confirmar_compra('Espada Goblin', 350)
                })
            })
    }

    function pagina_principal() {
        let embed = new MessageEmbed()
        .setDescription(`:crossed_swords: - Armas\n\n:fire: - Magias\n\n:mechanical_arm: - Armaduras\n\n:arrow_double_up: - Upgrades`)
        .setFooter("Clique em um dos emojis abaixo para selecionar a categoria de itens.")
    
        message.channel.send(message.author, embed)
            .then(msg => {
                msg.react('⚔️'); msg.react('🔥'); msg.react('🦾'); msg.react('⏫'); msg.react('❌')
    
                let f1 = (r, u) => r.emoji.name === "⚔️" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 1})
                let f2 = (r, u) => r.emoji.name === "🔥" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 1})
                let f3 = (r, u) => r.emoji.name === "🦾" && u.id === message.author.id;
                let c3 = msg.createReactionCollector(f3, {max: 1})
                let f4 = (r, u) => r.emoji.name === "⏫" && u.id === message.author.id;
                let c4 = msg.createReactionCollector(f4, {max: 1})
                let ff = (r, u) => r.emoji.name === "❌" && u.id === message.author.id;
                let cc = msg.createReactionCollector(ff, {max: 1})

                c1.on('collect', m => {
                    message.delete()
                    msg.delete()
                    pagina_armas_1()
                })
    
                cc.on('collect', m => {
                    message.delete()
                    msg.delete()
                    message.reply('Operação cancelada!').then(mm => setTimeout(function(){mm.delete()}, 2500))
                })
        })
    }

    pagina_principal()

}