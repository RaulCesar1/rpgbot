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
        let embedPrincipal = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário - Itens equipados`, message.author.avatarURL())
        .addField(`Arma Equipada:`, arma_equipada.length===0?'Você não equipou nenhuma arma ainda!':arma_equipada)
        .addField(`Armadura Equipada:`, armadura_equipada.length===0?'Você não equipou nenhuma armadura ainda!':armadura_equipada)
        .addField(magias_equipadas.length===1?'Magia Equipada:':'Magias Equipadas:', magias_equipadas.length===0?'Você não equipou nenhuma magia ainda!':magias_equipadas)

        let embedInventario = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário - Todos os itens`, message.author.avatarURL())
        .setDescription(inventario_itens.length===0?'**Você não possui nenhum item!**':inventario_itens)

        let embedTips = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário - Informações`, message.author.avatarURL())
        .setDescription(`**Limite do inventário: \`${limite_itens} itens\`**`)
        .addField(
            'Categoria dos emojis:',
            ':crossed_swords: - Suas armas.\n\n'+
            ':fire: - Suas magias.\n\n'+
            ':mechanical_arm: - Suas armaduras.\n\n'+
            ':briefcase: - Todos os seus itens.\n\n'+
            ':white_check_mark: - Itens equipados.'
        )

        let embedArmas = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário - Armas`, message.author.avatarURL())
        .setDescription(armas.length===0?'**Você não possui nenhuma arma!**':armas)

        let embedArmaduras = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário - Armaduras`, message.author.avatarURL())
        .setDescription(armaduras.length===0?'**Você não possui nenhuma armadura!**':armaduras)

        let embedMagias = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Seu inventário - Magias`, message.author.avatarURL())
        .setDescription(magias.length===0?'**Você não possui nenhuma magia!**':magias)
    
        message.channel.send(message.author, embedPrincipal)
            .then(msg => {
                msg.react('❗'); msg.react('✅'); msg.react('💼'); msg.react('⚔️'); msg.react('🔥'); msg.react('🦾')

                let f1 = (r, u) => r.emoji.name === "❗" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 100})
                let f2 = (r, u) => r.emoji.name === "💼" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 100})
                let f3 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c3 = msg.createReactionCollector(f3, {max: 100})
                let f4 = (r, u) => r.emoji.name === "⚔️" && u.id === message.author.id;
                let c4 = msg.createReactionCollector(f4, {max: 100})
                let f5 = (r, u) => r.emoji.name === "🔥" && u.id === message.author.id;
                let c5 = msg.createReactionCollector(f5, {max: 100})
                let f6 = (r, u) => r.emoji.name === "🦾" && u.id === message.author.id;
                let c6 = msg.createReactionCollector(f6, {max: 100})

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
    
    if(args[0] === "equipar") {
        let escolhas = ["arma", "armadura", "magia"]
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
