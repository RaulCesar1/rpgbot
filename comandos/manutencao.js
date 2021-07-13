const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const db = require('quick.db')

const token = cf.token
const botID = cf.botID

exports.run = async(client, message, args) => {
    const dbv = require('../index.js')
    var mf = require(`../utils/idiomas/${dbv.idm}.json`)
    var prefix = dbv.prefix
    
    if(!args[0]) {
        
        let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(mf["manutencao_1"].replace('{manutencao}', dbv.manutencao===true?'**ON**':'**OFF**'))

        message.channel.send(message.author, embed).then(async msg => {
            if(message.author.id === "693929568020725843") {
                msg.react('🔄')
    
                let f1 = (r, u) => r.emoji.name === "🔄" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 1})
    
                c1.on('collect', async m => {
                    dbv.manutencao===false?db.set('manutencao', true):db.set('manutencao', false)
                    dbv.manutencao = await db.fetch('manutencao')
                    message.delete()
                    msg.delete()
                    message.reply(dbv.manutencao===true?'Manutenção ativada.':'Manutenção desativada.')
                    .then(mm => setTimeout(function(){mm.delete()}, 2000))
                })
            } else {
                return
            }
        })

    }

}
