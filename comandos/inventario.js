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

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    function no_args() {
        let embedPrincipal = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(mf["inv_1"], message.author.avatarURL())
        .addField(mf["inv_14"], dbv.arma_equipada.length===0?mf["inv_15"]:dbv.arma_equipada)
        .addField(mf["inv_16"], dbv.armadura_equipada.length===0?mf["inv_17"]:dbv.armadura_equipada)
        .addField(dbv.magias_equipadas.length===1?mf["inv_18"]:mf["inv_19"], dbv.magias_equipadas.length===0?mf["inv_20"]:dbv.magias_equipadas)

        let embedInventario = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(mf["inv_13"], message.author.avatarURL())
        .setDescription(dbv.inventario_itens.length===0?mf["inv_12"]:dbv.inventario_itens)

        let embedTips = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(mf["inv_11"], message.author.avatarURL())
        .setDescription(mf["inv_10"].replace('{limite_itens}', dbv.limite_itens))
        .addField(mf["inv_3"], mf["inv_2"])

        let embedArmas = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(mf["inv_7"], message.author.avatarURL())
        .setDescription(dbv.armas.length===0?mf["inv_4"]:dbv.armas)

        let embedArmaduras = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(mf["inv_8"], message.author.avatarURL())
        .setDescription(dbv.armaduras.length===0?mf["inv_5"]:dbv.armaduras)

        let embedMagias = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(mf["inv_9"], message.author.avatarURL())
        .setDescription(dbv.magias.length===0?mf["inv_6"]:dbv.magias)
    
        message.channel.send(message.author, embedPrincipal)
            .then(msg => {
                msg.react('❗'); msg.react('✅'); msg.react('💼'); msg.react('⚔️'); msg.react('🔥'); msg.react('🦾')

                let f1 = (r, u) => r.emoji.name === "❗" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 20})
                let f2 = (r, u) => r.emoji.name === "💼" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 20})
                let f3 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c3 = msg.createReactionCollector(f3, {max: 20})
                let f4 = (r, u) => r.emoji.name === "⚔️" && u.id === message.author.id;
                let c4 = msg.createReactionCollector(f4, {max: 20})
                let f5 = (r, u) => r.emoji.name === "🔥" && u.id === message.author.id;
                let c5 = msg.createReactionCollector(f5, {max: 20})
                let f6 = (r, u) => r.emoji.name === "🦾" && u.id === message.author.id;
                let c6 = msg.createReactionCollector(f6, {max: 20})

                c1.on('collect', m => {
                    msg.reactions.resolve('❗').users.remove(message.author.id)
                    msg.edit(embedTips)
                })

                c2.on('collect', m => {
                    msg.reactions.resolve('💼').users.remove(message.author.id)
                    msg.edit(embedInventario)
                })
            
                c3.on('collect', m => {
                    msg.reactions.resolve('✅').users.remove(message.author.id)
                    msg.edit(embedPrincipal)
                })

                c4.on('collect', m => {
                    msg.reactions.resolve('⚔️').users.remove(message.author.id)
                    msg.edit(embedArmas)
                })

                c5.on('collect', m => {
                    msg.reactions.resolve('🔥').users.remove(message.author.id)
                    msg.edit(embedMagias)
                })

                c6.on('collect', m => {
                    msg.reactions.resolve('🦾').users.remove(message.author.id)
                    msg.edit(embedArmaduras)
                })
            })
        return
    }

    if(!args[0]) return no_args()
    
    if(args[0] === "equipar") {
        let escolhas = ["arma", "armadura", "magia", "weapon", "armor", "spell"]
        let escolhido = "";
        
        if(!args[1]) return message.reply(`use: \`${prefix}inventario equipar "arma/armadura/magia" "nome do item"\` sem as aspas!`)
        if(escolhas.indexOf(args[1]) === -1) return message.reply(`use: \`${prefix}inventario equipar "arma/armadura/magia" "nome do item"\` sem as aspas!`)
        if(!args[2]) return message.reply(`use: \`${prefix}inventario equipar ${args[1]} "nome do item"\` sem as aspas!`)
        args[1]==="arma"?escolhido="arma":args[1]==="armadura"?escolhido="armadura":escolhido="magia"

        argss = args
        argss.splice(0,2)
        let itemEscolhido = argss.join(" ")

        if(escolhido === "arma") {
            if(armas.indexOf(itemEscolhido) === -1) return message.reply('você não possui esta arma! Verifique se digitou corretamente.')
            if(itemEscolhido === arma_equipada) return message.reply(`você já está com esta arma equipada! Use: \`${prefix}inventario\``)
            try {
                await db.set(`${message.author.id}.arma_equipada`, itemEscolhido)
                message.reply(`a arma \`${itemEscolhido}\` foi equipada com sucesso!`)
            }catch(e){
                console.log(e)
            }
        } else if(escolhido === "armadura") {
            if(armaduras.indexOf(itemEscolhido) === -1) return message.reply('você não possui esta armadura! Verifique se digitou corretamente.')
            if(itemEscolhido === armadura_equipada) return message.reply(`você já está com esta armadura equipada! Use: \`${prefix}inventario\``)
            try {
                await db.set(`${message.author.id}.armadura_equipada`, itemEscolhido)
                message.reply(`a armadura \`${itemEscolhido}\` foi equipada com sucesso!`)
            }catch(e){
                console.log(e)
            }
        } else {
            if(magias.indexOf(itemEscolhido) === -1) return message.reply('você não possui esta magia! Verifique se digitou corretamente.')
            if(magias_equipadas.indexOf(itemEscolhido) >= 0) return message.reply(`você já está com esta magia equipada! Use: \`${prefix}inventario\``)
            try {
                magias_equipadas.length===3?magias.shift():magias
                await db.set(`${message.author.id}.magias_equipadas`, [...magias_equipadas, itemEscolhido])
                message.reply(`a magia \`${itemEscolhido}\` foi equipada com sucesso!`)
            }catch(e){
                console.log(e)
            }
        }
        return
    }

    if(user) {
        if(user.user.id === message.author.id) return no_args()

        let inventario_itens_user = db.fetch(`${user.user.id}.inventario_itens`)
        let jornada_user = db.fetch(`${user.user.id}.jornada`)
        if(jornada_user === false || !jornada_user) return message.reply(mf["banco_25"])

        let embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Inventário de: ${user.user.username}`, user.user.avatarURL())
        .setDescription(inventario_itens_user.length===0?'**Este usuário não possui nenhum item!**':inventario_itens_user)

        message.channel.send(message.author, embed)

        return
    }

}
