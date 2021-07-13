const { Discord, Client, MessageEmbed } = require('discord.js')
const cf = require('../utils/configs/config.json')
const db = require('quick.db')

const token = cf.token
const botID = cf.botID

exports.run = async(client, message, args, comando) => {
    const dbv = require('../index.js')
    var mf = require(`../utils/idiomas/${dbv.idm}.json`)
    var prefix = dbv.prefix
    
    if(dbv.manutencao === true) return message.reply(mf["maintenance"])
    if(!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"].replace('PREFIX', prefix))

    // team vars

    var time_disponivel = db.fetch(`${message.author.id}.time_disponivel`)
    var times_uID = db.fetch(`times.uID`)
    var times_criados = db.fetch('times.criados')
    
    //

    if(!args[0] && time_disponivel === false) {
        let time = db.fetch(`${message.author.id}.time`)

        let time_id = db.fetch(`${time}.id`)
        let time_membros = db.fetch(`${time}.membros`)
        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)
        let time_cofre = db.fetch(`${time}.cofre`)
        let time_criador = db.fetch(`${time}.criador`)
        let time_bonus = db.fetch(`${time}.bonus`)
        let time_tag = db.fetch(`${time}.tag`)

        let painel_inf_embed_p1 = new MessageEmbed()
        .setColor("#00f4ff")
        .setAuthor(`${time} (${time_tag})`)
        .addField(`ID do time:`, time_id, true)
        .addField(`Quantidade de membros:`, time_membros_quantidade===1?`${time_membros_quantidade} membro`:`${time_membros_quantidade} membros`, true)
        .addField(`Criador do time:`, time_criador, true)
        .addField(`Bônus do time:`, `${time_bonus}%`, true)
        .addField(`Cofre do time:`, time_cofre<=1?`${time_cofre} coin`:`${time_cofre} coins`, true)

        let painel_inf_embed_p2 = new MessageEmbed()
        .setColor("#00f4ff")
        .setAuthor(`${time} (${time_tag})`)
        .addField(`Membros do time:`, time_membros)

        message.channel.send(message.author, painel_inf_embed_p1)
        .then(msg => {
            msg.react('⬅️');msg.react('➡️')

            let f1 = (r, u) => r.emoji.name === "➡️" && u.id === message.author.id;
            let c1 = msg.createReactionCollector(f1, {max: 100})
            let f2 = (r, u) => r.emoji.name === "⬅️" && u.id === message.author.id;
            let c2 = msg.createReactionCollector(f2, {max: 100})

            c1.on('collect', mm => {
                msg.reactions.resolve('➡️').users.remove(message.author.id)
                msg.edit(painel_inf_embed_p2)
            })

            c2.on('collect', mm => {
                msg.reactions.resolve('⬅️').users.remove(message.author.id)
                msg.edit(painel_inf_embed_p1)
            })
        })
        return
    }

    if(!args[0] && time_disponivel === true || args[0] === "ajuda") {
        let embed = new MessageEmbed()
        .setAuthor('Comandos De Time')
        .setColor("BLUE")
        .setDescription(
            `${prefix}time criar\n`+
            `${prefix}time deletar\n`+
            `${prefix}time ajuda\n`+
            `${prefix}time sair\n`+
            `${prefix}time depositar\n`+
            `${prefix}time bonus\n`+
            `${prefix}time melhorar\n`+
            `${prefix}time convidar`
        )

        message.channel.send(message.author, embed)
        return
    }

    if(args[0] === "criar") {
        if(time_disponivel === false) return message.reply("você já está em um time! Saia dele antes de criar outro.")

        function criar_time(nome, tag) {
            let embed_criado_sucesso = new MessageEmbed()
            .setAuthor('Time criado com sucesso!')
            .addField('Nome do time:', nome)
            .addField('TAG do time:', tag)
            .setColor('YELLOW')
            .setDescription(`Utilize \`${prefix}time\` e veja o painel de informações do seu time!`)
            
            times_uID += 1

            db.set(`${nome}.id`, times_uID)
            db.set(`${nome}.membros`, [message.author.username])
            db.set(`${nome}.membros_quantidade`, 1)
            db.set(`${nome}.cofre`, 0)
            db.set(`${nome}.criador`, message.author.username)
            db.set(`${nome}.bonus`, 0.15)
            db.set(`${nome}.tag`, tag)

            db.push(`times.criados`, nome)
            db.set(`times.uID`, times_uID)

            db.set(`${message.author.id}.time_disponivel`, false)
            db.set(`${message.author.id}.time`, nome)

            message.channel.send(message.author, embed_criado_sucesso)
        }

        message.reply('qual vai ser o nome do time? (Máximo de 15 caracteres)\nEnvie "cancelar" para cancelar o processo.')
        .then(function(){
            message.channel.awaitMessages(res => message.content, {
              max: 1,
              time: 180000,
              errors: ['time']
            })
            .then((nome_time) => {
              if(nome_time.first().content === "cancelar") {
                  message.reply('operação cancelada.').then(msg => setTimeout(() => msg.delete(), 2500))
                  return
              }

              if(nome_time.first().content.length>15) {
                  message.reply('o nome do time não pode ser maior que 15 caracteres!')
                  return
              }
              
              if(nome_time.first().content.length<4) {
                  message.reply('o nome do time precisa ser maior que 4 caracteres!')
                  return
              }
              
              message.reply('qual vai ser a TAG do time? (Máximo de 8 caracteres)\nEnvie "cancelar" para cancelar o processo.')
              .then(function(){
                message.channel.awaitMessages(res => message.content, {
                  max: 1,
                  time: 180000,
                  errors: ['time']
                })
                .then((tag_time) => {
                    if(tag_time.first().content === "cancelar") {
                        message.reply('operação cancelada.').then(msg => setTimeout(() => msg.delete(), 2500))
                        return
                    }
      
                    if(tag_time.first().content.length>8) {
                        message.reply('a tag do time não pode ser maior que 8 caracteres!')
                        return
                    }

                    if(tag_time.first().content.length<3) {
                        message.reply('a tag do time precisa ser maior que 3 caracteres!')
                        return
                    }

                    criar_time(nome_time.first().content, tag_time.first().content)
                    
                })
            })
              
            })
        })

        return
    }
}