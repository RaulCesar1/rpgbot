const { Discord, Client, MessageEmbed, MessageReaction } = require('discord.js')
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
    var tags_criadas = db.fetch('times.tags')
    
    //

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if(!args[0] && time_disponivel === false) {
        let time = db.fetch(`${message.author.id}.time`)

        let time_id = db.fetch(`${time}.id`)
        let time_membros = db.fetch(`${time}.membros`)
        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)
        let time_cofre = db.fetch(`${time}.cofre`)
        let time_criador = db.fetch(`${time}.criador`)
        let time_bonus = db.fetch(`${time}.bonus`)
        let time_tag = db.fetch(`${time}.tag`)
        let time_criador_id = db.fetch(`${time}.criador_id`)

        let painel_inf_embed_p1 = new MessageEmbed()
        .setColor("#00f4ff")
        .setAuthor(`${time} (${time_tag})`)
        .addField(`ID do time:`, time_id, true)
        .addField(`Quantidade de membros:`, time_membros_quantidade===1?`${time_membros_quantidade} membro`:`${time_membros_quantidade} membros`, true)
        .addField(`Criador do time:`, `${time_criador} (${time_criador_id})`, true)
        .addField(`Bônus do time:`, `\`${prefix}time bonus\``, true)
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

    if(args[0] === "sair") {
        let time = db.fetch(`${message.author.id}.time`)
        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)

        if(times_criados.indexOf(time) === -1) 
            return message.reply('você não está em um time!')

        if(time_membros_quantidade===1)
            return message.reply(`você é o único membro do time, utilize: \`${prefix}time deletar\``)

        function sair_time() {
            db.set(`${message.author.id}.time_disponivel`, true)
            db.delete(`${message.author.id}.time`)

            message.reply(`você saiu do seu time!`)
        }

        let embedConfirmacao = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`Tem certeza que deseja sair de ${time} ?`, message.author.avatarURL())

        message.channel.send(message.author, embedConfirmacao)
            .then(msg => {
                msg.react('✅'); msg.react('❌')

                let f1 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {max: 1})
                let f2 = (r, u) => r.emoji.name === "❌" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {max: 1})

                c1.on('collect', m => {
                    msg.delete()
                    message.delete()
                    sair_time()
                })

                c2.on('collect', m => {
                    msg.delete()
                    message.delete()
                    message.reply(mf["op_cancel"])
                        .then(mm => setTimeout(() => mm.delete(), 4000))
                })
            })
        return
    }

    if(args[0] === "lt") {
        message.channel.send(times_criados)
        message.channel.send(tags_criadas)
    }

    if(args[0] === "deletar") {
        let time = db.fetch(`${message.author.id}.time`)

        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)
        let time_tag = db.fetch(`${time}.tag`)
        let time_criador_id = db.fetch(`${time}.criador_id`)

        function deletar_time() {
            db.delete(`${time}.id`)
            db.delete(`${time}.membros`)
            db.delete(`${time}.membros_quantidade`)
            db.delete(`${time}.cofre`)
            db.delete(`${time}.criador`)
            db.delete(`${time}.bonus`)
            db.delete(`${time}.tag`)
            db.delete(`${time}.criador_id`)
            db.delete(`${time}.convites`)
            db.delete(`${time}.limite_membros`)
            db.delete(`${time}.convites_ui`)

            db.delete(`${time}.desconto_armas`)
            db.delete(`${time}.desconto_armaduras`)
            db.delete(`${time}.desconto_magias`)
            db.delete(`${time}.bonus_xp`)
            db.delete(`${time}.bonus_coins`)

            db.set(`${message.author.id}.time_disponivel`, true)
            db.delete(`${message.author.id}.time`)

            times_criados.splice(times_criados.indexOf(time), 1)
            db.set('times.criados', times_criados)

            tags_criadas.splice(tags_criadas.indexOf(time_tag), 1)
            db.set('times.tags', tags_criadas)

            message.reply(`o time \`${time}\` foi deletado.`)
        }
        
        if(time_membros_quantidade === 1) return del_msg_confirm() 

        if(times_criados.indexOf(time) === -1) return message.reply(`você precisa estar em um time para poder excluí-lo!`)
        if(time_criador_id !== message.author.id) return message.reply(`você precisa ser o líder do time para poder excluí-lo!`)

        function del_msg_confirm() {
            message.reply(`digite \`${time}\` para confirmar a exclusão do time.\nDigite \`cancelar\` para cancelar o processo`)
            .then(function(){
                message.channel.awaitMessages(res => message.content, {
                max: 1,
                time: 180000,
                errors: ['time']
                })
                .then((nome_time) => {
                if(nome_time.first().content === "cancelar") {
                    message.reply(mf["op_cancel"]).then(msg => setTimeout(() => msg.delete(), 2500))
                    return
                }

                if(nome_time.first().content !== time)
                    return message.reply('não foi possível deletar seu time, verifique se digitou corretamente.')
    
                deletar_time()
    
                })
            })
        }
        return
    }

    if(args[0] === "bonus") {
        let time = db.fetch(`${message.author.id}.time`)

        if(times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_desconto_armas = db.fetch(`${time}.desconto_armas`)
        let time_desconto_armaduras = db.fetch(`${time}.desconto_armaduras`)
        let time_desconto_magias = db.fetch(`${time}.desconto_magias`)
        let time_bonus_xp = db.fetch(`${time}.bonus_xp`)
        let time_bonus_coins = db.fetch(`${time}.bonus_coins`)

        let embed_bonus = new MessageEmbed()
        .setAuthor('Bônus do time')
        .setColor("#00f4ff")
        .addField(`Desconto nas armas:`, `${time_desconto_armas}%`, true)
        .addField(`Desconto nas armaduras:`, `${time_desconto_armaduras}%`, true)
        .addField(`Desconto nas magias:`, `${time_desconto_magias}%`, true)
        .addField(`Bônus de XP:`, `${time_bonus_xp}%`, true)
        .addField(`Bônus de coins`, `${time_bonus_coins}%`, true)

        message.channel.send(message.author, embed_bonus)
    }

    if(!args[0] && time_disponivel === true || args[0] === "ajuda") {
        let embed = new MessageEmbed()
        .setAuthor('Comandos De Time')
        .setColor("#00f4ff")
        .setDescription(
            `${prefix}time criar\n`+
            `${prefix}time deletar\n`+
            `${prefix}time ajuda\n`+
            `${prefix}time sair\n`+
            `${prefix}time depositar\n`+
            `${prefix}time bonus\n`+
            `${prefix}time melhorar\n`+
            `${prefix}time convidar\n`+
            `${prefix}time convites\n`+
            `${prefix}time cofre`
        )

        message.channel.send(message.author, embed)
        return
    }

    if(args[0] === "depositar") {
        let time = db.fetch(`${message.author.id}.time`)

        if(times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        if(!args[1]) return message.reply(`use: \`${prefix}time depositar <quantidade-de-coins>\``)
        if(isNaN(args[1])) return message.reply(`o valor inserido precisa ser um número!`)
        if(args[1] > dbv.coins) return message.reply(`você não tem coins suficiente para depositar!`)
        if(args[1] <= 0) return message.reply('o valor inserido precisa ser no mínimo `1`!')

        let time_cofre = db.fetch(`${time}.cofre`)

        let para_deposito = parseInt(args[1], 10)

        function depositar_time() {
            time_cofre+=para_deposito
            db.set(`${time}.cofre`, time_cofre)

            dbv.coins -= para_deposito
            db.set(`${message.author.id}.coins`, dbv.coins)

            message.reply(`você depositou \`${args[1]} coins\` no cofre do time!`)
        }

        depositar_time()
        return
    }

    if(args[0] === "cofre") {
        let time = db.fetch(`${message.author.id}.time`)

        if(times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_cofre = db.fetch(`${time}.cofre`)

        let embed_cofre = new MessageEmbed()
        .setColor("#00f4ff")
        .setAuthor("Cofre do time")
        .setDescription(time_cofre===0?'Seu time não possui nenhum coin depositado no cofre!':`Seu time possui \`${time_cofre} coins\` depositados no cofre!`)

        message.channel.send(message.author, embed_cofre)
        return
    }

    if(args[0] === "convites") {
        let time = db.fetch(`${message.author.id}.time`)

        if(times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_convites = db.fetch(`${time}.convites`)
        let time_convites_ui = db.fetch(`${time}.convites_ui`)

        let embed_convites = new MessageEmbed()
        .setColor("#00f4ff")
        .setAuthor("Convites pendentes:")
        .setDescription(time_convites.length===0?"Seu time não possui nenhum convite pendente!":time_convites_ui)

        message.channel.send(message.author, embed_convites)
    }

    if(args[0] === "convidar") {
        let time = db.fetch(`${message.author.id}.time`)

        if(times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_id = db.fetch(`${time}.id`)
        let time_membros = db.fetch(`${time}.membros`)
        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)
        let time_cofre = db.fetch(`${time}.cofre`)
        let time_criador = db.fetch(`${time}.criador`)
        let time_bonus = db.fetch(`${time}.bonus`)
        let time_tag = db.fetch(`${time}.tag`)
        let time_criador_id = db.fetch(`${time}.criador_id`)
        let time_convites = db.fetch(`${time}.convites`)
        let time_limite_membros = db.fetch(`${time}.limite_membros`)
        let time_convites_ui = db.fetch(`${time}.convites_ui`)

        if(args[1] === "excluir") {
            if(!user) return message.reply(`use: \`${prefix}time convidar excluir <@usuário>\``)
            if(time_convites.indexOf(user.user.id) === -1) return message.reply(`este usuário não foi convidado para o seu time!\nPara ver todos os convites pendentes, use: \`${prefix}time convites\``)
            
            function deletar_convite() {
                time_convites.splice(time_convites.indexOf(user.user.id), 1)
                time_convites_ui.splice(time_convites_ui.indexOf(`${user.user.username} (${user.user.id})`), 1)
                db.set(`${time}.convites`, time_convites)
                db.set(`${time}.convites_ui`, time_convites_ui)

                message.reply(`convite para \`${user.user.username}\` excluido com sucesso.`)
            }

            deletar_convite()
            
            return
        }

        if(!user) return message.reply(`use: \`${prefix}time convidar <@usuário>\``)
        if(times_criados.indexOf(time) === -1) return message.reply(`você precisa estar em um time para poder convidar!`)
        if(time_convites.indexOf(user.user.id) >= 0) return message.reply(`você já convidou este usuário!\nCaso queira excluir o convite, use: \`${prefix}time convidar excluir <@usuário>\``)
        
        let time_user = db.fetch(`${user.user.id}.time`)
            
        if(times_criados.indexOf(time_user) >= 0) return message.reply('este usuário já está em um time!')
        //if(user.user.id === message.author.id) return message.reply('você não consegue se convidar!')

        function convidar() {
            let embed_convite = new MessageEmbed()
            .setAuthor(`Novo convite para time!`)
            .setDescription(`${message.author.username} convidou você para participar de \`${time}\``)
            .addField(`ID do time:`, time_id)
            .setColor("AQUA")

            db.push(`${time}.convites`, user.user.id)
            db.push(`${time}.convites_ui`, `${user.user.username} (${user.user.id})`)

            user.user.send(embed_convite).catch(() => message.reply('não foi possível notificar este usuário, talvez a DM dele esteja fechada!'))
            message.reply(`usuário convidado com sucesso!\nPara ver todos os convites pendentes, use: \`${prefix}time convites\``)
        }

        convidar()
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
            db.set(`${nome}.criador_id`, message.author.id)
            db.set(`${nome}.tag`, tag)
            db.set(`${nome}.convites`, [])
            db.set(`${nome}.limite_membros`, 25)
            db.set(`${nome}.convites_ui`, [])
            
            //bonus

            db.set(`${nome}.desconto_armas`, 0.2)
            db.set(`${nome}.desconto_armaduras`, 0.2)
            db.set(`${nome}.desconto_magias`, 0.2)
            db.set(`${nome}.bonus_xp`, 0.1)
            db.set(`${nome}.bonus_coins`, 0.1)

            //

            db.push('times.tags', tag)
            db.push(`times.criados`, nome)
            db.set(`times.uID`, times_uID)

            db.set(`${message.author.id}.time_disponivel`, false)
            db.set(`${message.author.id}.time`, nome)

            message.channel.send(message.author, embed_criado_sucesso)
        }

        message.reply('qual vai ser o nome do time? (Máximo de 64 caracteres)\nEnvie "cancelar" para cancelar o processo.')
        .then(function(){
            message.channel.awaitMessages(res => message.content, {
              max: 1,
              time: 180000,
              errors: ['time']
            })
            .then((nome_time) => {
              if(nome_time.first().content === "cancelar") {
                  message.reply(mf["op_cancel"]).then(msg => setTimeout(() => msg.delete(), 2500))
                  return
              }

              if(nome_time.first().content.length>64) {
                  message.reply('o nome do time não pode ser maior que 64 caracteres!')
                  return
              }
              
              if(nome_time.first().content.length<2) {
                  message.reply('o nome do time precisa ser maior que 2 caracteres!')
                  return
              }

              if(times_criados.indexOf(nome_time.first().content) >= 0)
                return message.reply('este nome já está em uso.')
              
              message.reply('qual vai ser a TAG do time? (Máximo de 12 caracteres)\nEnvie "cancelar" para cancelar o processo.')
              .then(function(){
                message.channel.awaitMessages(res => message.content, {
                  max: 1,
                  time: 180000,
                  errors: ['time']
                })
                .then((tag_time) => {
                    if(tag_time.first().content === "cancelar") {
                        message.reply(mf["op_cancel"]).then(msg => setTimeout(() => msg.delete(), 2500))
                        return
                    }
      
                    if(tag_time.first().content.length>12) {
                        message.reply('a tag do time não pode ser maior que 12 caracteres!')
                        return
                    }

                    if(tag_time.first().content.length<1) {
                        message.reply('a tag do time precisa ser maior que 1 caractere!')
                        return
                    }

                    if(times_criados.indexOf(nome_time.first().content) >= 0)
                    return message.reply('esta TAG já está em uso.')

                    criar_time(nome_time.first().content, tag_time.first().content)
                    
                })
            })
              
            })
        })

        return
    }
}