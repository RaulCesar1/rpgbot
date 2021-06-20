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
    if(!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"].replace('PREFIX', prefix))

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
                    message.delete()
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
                    message.delete()
                    message.reply('operação cancelada!').then(mm => {
                        setTimeout(function(){mm.delete()}, 2000)
                    })
                })
            })
    }
    
    confirmar_compra('Espada Goblin', 350, 'armas')
}