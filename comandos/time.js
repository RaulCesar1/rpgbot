const {
    Discord,
    Client,
    MessageEmbed,
    MessageReaction
} = require('discord.js')
const cf = require('../utils/configs/config.json')
const db = require('quick.db')

const token = cf.token
const botID = cf.botID

const configs = {
    max_bonus_level: 255
}

exports.run = async (client, message, args, comando) => {
    const dbv = require('../index.js')
    var mf = require(`../utils/idiomas/${dbv.idm}.json`)
    var prefix = dbv.prefix

    if (dbv.manutencao === true) return message.reply(mf["maintenance"])
    if (!dbv.jornada || dbv.jornada === false) return message.reply(mf["to_start"].replace('PREFIX', prefix))

    // team vars

    var time_disponivel = db.fetch(`${message.author.id}.time_disponivel`)
    var times_uID = db.fetch(`times.uID`)
    var times_criados = db.fetch('times.criados')
    var tags_criadas = db.fetch('times.tags')

    //

    const user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])

    if (!args[0] && time_disponivel === false) {
        let time = db.fetch(`${message.author.id}.time`)

        let time_id = db.fetch(`${time}.id`)
        let time_membros = db.fetch(`${time}.membros`)
        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)
        let time_cofre = db.fetch(`${time}.cofre`)
        let time_criador = db.fetch(`${time}.criador`)
        let time_bonus = db.fetch(`${time}.bonus`)
        let time_tag = db.fetch(`${time}.tag`)
        let time_criador_id = db.fetch(`${time}.criador_id`)
        let time_limite_membros = db.fetch(`${time}.limite_membros`)

        let painel_inf_embed_p1 = new MessageEmbed()
            .setColor("#00f4ff")
            .setAuthor(`${time} (${time_tag})`)
            .addField(`ID do time:`, time_id, true)
            .addField(`Quantidade de membros:`, time_membros_quantidade === 1 ? `${time_membros_quantidade} membro de ${time_limite_membros}` : `${time_membros_quantidade} membros de ${time_limite_membros}`, true)
            .addField(`Criador do time:`, `${time_criador} (${time_criador_id})`, true)
            .addField(`Bônus do time:`, `\`${prefix}time bonus\``, true)
            .addField(`Cofre do time:`, `\`${prefix}time cofre\``, true)

        let painel_inf_embed_p2 = new MessageEmbed()
            .setColor("#00f4ff")
            .setAuthor(`${time} (${time_tag})`)
            .addField(`Membros do time:`, time_membros)

        message.channel.send(message.author, painel_inf_embed_p1)
            .then(msg => {
                msg.react('👥')

                var qual = true

                let f1 = (r, u) => r.emoji.name === "👥" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {
                    max: 100
                })

                c1.on('collect', mm => {
                    msg.reactions.resolve('👥').users.remove(message.author.id)
                    qual === true ? msg.edit(painel_inf_embed_p2) : msg.edit(painel_inf_embed_p1)
                    qual === true ? qual = false : qual = true
                })
            })
        return
    }

    if (args[0] === "melhorar") {
        let time = db.fetch(`${message.author.id}.time`)

        if (times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_tag = db.fetch(`${time}.tag`)
        let time_criador_id = db.fetch(`${time}.criador_id`)
        let time_desconto_armas = db.fetch(`${time}.desconto_armas`)
        let time_desconto_armaduras = db.fetch(`${time}.desconto_armaduras`)
        let time_desconto_magias = db.fetch(`${time}.desconto_magias`)
        let time_bonus_xp = db.fetch(`${time}.bonus_xp`)
        let time_bonus_coins = db.fetch(`${time}.bonus_coins`)
        let time_limite_membros = db.fetch(`${time}.limite_membros`)
        let time_cofre = db.fetch(`${time}.cofre`)

        let time_desconto_armas_p = db.fetch(`${time}.desconto_armas_p`)
        let time_desconto_armaduras_p = db.fetch(`${time}.desconto_armaduras_p`)
        let time_desconto_magias_p = db.fetch(`${time}.desconto_magias_p`)
        let time_bonus_xp_p = db.fetch(`${time}.bonus_xp_p`)
        let time_bonus_coins_p = db.fetch(`${time}.bonus_coins_p`)
        let time_limite_membros_p = db.fetch(`${time}.limite_membros_p`)
        let time_desconto_armas_l = db.fetch(`${time}.desconto_armas_l`)
        let time_desconto_armaduras_l = db.fetch(`${time}.desconto_armaduras_l`)
        let time_desconto_magias_l = db.fetch(`${time}.desconto_magias_l`)
        let time_bonus_xp_l = db.fetch(`${time}.bonus_xp_l`)
        let time_bonus_coins_l = db.fetch(`${time}.bonus_coins_l`)
        let time_limite_membros_l = db.fetch(`${time}.limite_membros_l`)

        if (message.author.id !== time_criador_id) return message.reply(`você precisa ser o líder do time para utilizar este comando!`)

        let embed_melhorias = new MessageEmbed()
            .setAuthor(`${time_tag} - Melhorias`)
            .setColor("#00f4ff")
            .addField(':one: - Desconto nas armas', `\`Nível ${time_desconto_armas_l} ➠ ${time_desconto_armas_l + 1}\` ${time_desconto_armas_p} moedas`)
            .addField(':two: - Desconto nas armaduras', `\`Nível ${time_desconto_armaduras_l} ➠ ${time_desconto_armaduras_l + 1}\` ${time_desconto_armaduras_p} moedas`)
            .addField(':three: - Desconto nas magias', `\`Nível ${time_desconto_magias_l} ➠ ${time_desconto_magias_l + 1}\` ${time_desconto_magias_p} moedas`)
            .addField(':four: - Bônus de XP', `\`Nível ${time_bonus_xp_l} ➠ ${time_bonus_xp_l + 1}\` ${time_bonus_xp_p} moedas`)
            .addField(':five: - Bônus de moedas', `\`Nível ${time_bonus_coins_l} ➠ ${time_bonus_coins_l + 1}\` ${time_bonus_coins_p} moedas`)
            .addField(':six: - Limite de membros', `\`${time_limite_membros} membros ➠ ${time_limite_membros + 1} membros\` ${time_limite_membros_p} moedas`)
            .setFooter('Reaja com os emojis abaixo para melhorar')

        function melhorar_bonus(bonus, mult, price, adc, b_ui) {
            if (price > time_cofre) return message.reply(`seu time não tem moedas suficiente no cofre!\nUtilize \`${prefix}time cofre\``).then(msg => setTimeout(() => msg.delete(), 4000))

            let bonus_v = db.fetch(`${time}.${bonus}`)
            let price_v = db.fetch(`${time}.${bonus}_p`)
            let bonus_l = db.fetch(`${time}.${bonus}_l`)

            bonus_v = bonus_v + mult
            bonus_l = bonus_l + 1
            price_v = price_v + adc
            time_cofre = time_cofre - price

            db.set(`${time}.${bonus}`, bonus_v)
            db.set(`${time}.${bonus}_p`, price_v)
            db.set(`${time}.${bonus}_l`, bonus_l)
            db.set(`${time}.cofre`, time_cofre)

            bonus === 'limite_membros' ? message.reply(`transação realizada com sucesso! **\`${b_ui} ➠ ${bonus_v} membros\`**`) : message.reply(`transação realizada com sucesso! **\`${b_ui} ➠ ${bonus_v}%\`**`)
        }

        message.delete()
        message.channel.send(message.author, embed_melhorias)
            .then(msg => {
                msg.react('1️⃣');
                msg.react('2️⃣');
                msg.react('3️⃣');
                msg.react('4️⃣');
                msg.react('5️⃣');
                msg.react('6️⃣')

                let f1 = (r, u) => r.emoji.name === "1️⃣" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {
                    max: 1
                })
                let f2 = (r, u) => r.emoji.name === "2️⃣" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {
                    max: 1
                })
                let f3 = (r, u) => r.emoji.name === "3️⃣" && u.id === message.author.id;
                let c3 = msg.createReactionCollector(f3, {
                    max: 1
                })
                let f4 = (r, u) => r.emoji.name === "4️⃣" && u.id === message.author.id;
                let c4 = msg.createReactionCollector(f4, {
                    max: 1
                })
                let f5 = (r, u) => r.emoji.name === "5️⃣" && u.id === message.author.id;
                let c5 = msg.createReactionCollector(f5, {
                    max: 1
                })
                let f6 = (r, u) => r.emoji.name === "6️⃣" && u.id === message.author.id;
                let c6 = msg.createReactionCollector(f6, {
                    max: 1
                })

                c1.on('collect', mm => {
                    msg.delete()
                    melhorar_bonus('desconto_armas', 0.2, time_desconto_armas_p, 200, 'Desconto nas armas')
                })

                c2.on('collect', mm => {
                    msg.delete()
                    melhorar_bonus('desconto_armaduras', 0.2, time_desconto_armaduras_p, 200, 'Desconto nas armaduras')
                })

                c3.on('collect', mm => {
                    msg.delete()
                    melhorar_bonus('desconto_magias', 0.2, time_desconto_magias_p, 200, 'Desconto nas magias')
                })

                c4.on('collect', mm => {
                    msg.delete()
                    melhorar_bonus('bonus_xp', 0.1, time_bonus_xp_p, 300, 'Bônus de XP')
                })

                c5.on('collect', mm => {
                    msg.delete()
                    melhorar_bonus('bonus_coins', 0.1, time_bonus_coins_p, 300, 'Bônus de coins')
                })

                c6.on('collect', mm => {
                    msg.delete()
                    melhorar_bonus('limite_membros', 1, time_limite_membros_p, 0, 'Limite de membros')
                })
            })
        return
    }

    if (args[0] === "sair") {
        let time = db.fetch(`${message.author.id}.time`)
        let time_membros_quantidade = db.fetch(`${time}.membros_quantidade`)
        let time_membros = db.fetch(`${time}.membros`)

        if (times_criados.indexOf(time) === -1)
            return message.reply('você não está em um time!')

        if (time_membros_quantidade === 1)
            return message.reply(`você é o único membro do time, utilize: \`${prefix}time deletar\``)

        function sair_time() {
            db.set(`${message.author.id}.time_disponivel`, true)
            db.delete(`${message.author.id}.time`)
            db.set(`${time}.membros_quantidade`, time_membros_quantidade-1)
            time_membros.splice(time_membros.indexOf(message.author.username), 1)
            db.set(`${time}.membros`, time_membros)

            message.reply(`você saiu do seu time!`)
        }

        let embedConfirmacao = new MessageEmbed()
            .setColor("RED")
            .setAuthor(`Tem certeza que deseja sair de ${time} ?`, message.author.avatarURL())

        message.channel.send(message.author, embedConfirmacao)
            .then(msg => {
                msg.react('✅');
                msg.react('❌')

                let f1 = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {
                    max: 1
                })
                let f2 = (r, u) => r.emoji.name === "❌" && u.id === message.author.id;
                let c2 = msg.createReactionCollector(f2, {
                    max: 1
                })

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

    if (args[0] === "lt") {
        message.channel.send(times_criados)
        message.channel.send(tags_criadas)
    }

    if (args[0] === "deletar") {
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

            db.delete(`${time}.desconto_armas_p`)
            db.delete(`${time}.desconto_armaduras_p`)
            db.delete(`${time}.desconto_magias_p`)
            db.delete(`${time}.bonus_xp_p`)
            db.delete(`${time}.bonus_coins_p`)

            db.delete(`${time}.desconto_armas_l`)
            db.delete(`${time}.desconto_armaduras_l`)
            db.delete(`${time}.desconto_magias_l`)
            db.delete(`${time}.bonus_xp_l`)
            db.delete(`${time}.bonus_coins_l`)

            db.delete(`${time}.limite_membros_p`)
            db.delete(`${time}.limite_membros_l`)

            db.delete(`${time}.finalizado`)

            db.set(`${message.author.id}.time_disponivel`, true)
            db.delete(`${message.author.id}.time`)

            times_criados.splice(times_criados.indexOf(time), 1)
            db.set('times.criados', times_criados)

            tags_criadas.splice(tags_criadas.indexOf(time_tag), 1)
            db.set('times.tags', tags_criadas)

            message.reply(`o time \`${time}\` foi deletado.`)
        }

        if (time_membros_quantidade === 1) return del_msg_confirm()

        if (times_criados.indexOf(time) === -1) return message.reply(`você precisa estar em um time para poder excluí-lo!`)
        if (time_criador_id !== message.author.id) return message.reply(`você precisa ser o líder do time para poder excluí-lo!`)

        function del_msg_confirm() {
            message.reply(`digite \`${time}\` para confirmar a exclusão do time.\nDigite \`cancelar\` para cancelar o processo`)
                .then(function() {
                    message.channel.awaitMessages(res => message.content, {
                            max: 1,
                            time: 180000,
                            errors: ['time']
                        })
                        .then((nome_time) => {
                            if (nome_time.first().content === "cancelar") {
                                message.reply(mf["op_cancel"]).then(msg => setTimeout(() => msg.delete(), 2500))
                                return
                            }

                            if (nome_time.first().content !== time)
                                return message.reply('não foi possível deletar seu time, verifique se digitou corretamente.')

                            deletar_time()

                        })
                })
        }
        return
    }

    if (args[0] === "bonus") {
        let time = db.fetch(`${message.author.id}.time`)

        if (times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_desconto_armas = db.fetch(`${time}.desconto_armas`)
        let time_desconto_armaduras = db.fetch(`${time}.desconto_armaduras`)
        let time_desconto_magias = db.fetch(`${time}.desconto_magias`)
        let time_bonus_xp = db.fetch(`${time}.bonus_xp`)
        let time_bonus_coins = db.fetch(`${time}.bonus_coins`)

        let time_desconto_armas_l = db.fetch(`${time}.desconto_armas_l`)
        let time_desconto_armaduras_l = db.fetch(`${time}.desconto_armaduras_l`)
        let time_desconto_magias_l = db.fetch(`${time}.desconto_magias_l`)
        let time_bonus_xp_l = db.fetch(`${time}.bonus_xp_l`)
        let time_bonus_coins_l = db.fetch(`${time}.bonus_coins_l`)
        let time_limite_membros_l = db.fetch(`${time}.limite_membros_l`)

        let time_bonus_total_soma_l = time_desconto_armaduras_l + time_desconto_magias_l + time_bonus_xp_l + time_bonus_coins_l + time_limite_membros_l + time_desconto_armas_l

        let time_finalizado = db.fetch(`${time}.finalizado`)

        let time_progresso = (time_bonus_total_soma_l * 100) / configs.max_bonus_level

        let embed_bonus = new MessageEmbed()
            .setAuthor('Bônus do time')
            .setColor("#00f4ff")
            .setDescription(`Progresso do time: **\`${time_progresso}%\`**`)
            .addField(`Desconto nas armas:`, `**\`${time_desconto_armas}%\`**`, true)
            .addField(`Desconto nas armaduras:`, `**\`${time_desconto_armaduras}%\`**`, true)
            .addField(`Desconto nas magias:`, `**\`${time_desconto_magias}%\`**`, true)
            .addField(`Bônus de XP:`, `**\`${time_bonus_xp}%\`**`, true)
            .addField(`Bônus de moedas`, `**\`${time_bonus_coins}%\`**`, true)

        message.channel.send(message.author, embed_bonus)
    }

    if(args[0] === "entrar") {
        if(time_disponivel === false) return message.reply(`você já está em um time! Saia dele antes de entrar em outro!`)
        if(!args[1]) return message.reply(`utilize: \`${prefix}time entrar <id-do-time>\``)

        function fetch_id(team_name) {
            let fid
            let fteam
            times_criados.forEach(time => {
                let time_id = db.fetch(`${time}.id`)
                idf = parseInt(args[1], 10)
                if(time_id === idf) {
                    fid = time_id
                    fteam = time
                }
            })
            if(times_criados.indexOf(fteam) === -1) return message.reply(`este time não existe!`)
            return {fid, fteam}
        }

        let fteam = fetch_id(args[1]).fteam
        let fteam_convites = db.fetch(`${fteam}.convites`)
        let fteam_convites_ui = db.fetch(`${fteam}.convites_ui`)
        let fteam_limite_membros = db.fetch(`${fteam}.limite_membros`)
        let fteam_membros_quantidade = db.fetch(`${fteam}.membros_quantidade`)
        let user_time = db.fetch(`${message.author.id}.time`)

        if(fteam_convites.indexOf(message.author.id) === -1) return message.reply(`você não foi convidado para esse time!`)
        if(fteam_membros_quantidade === fteam_limite_membros) return message.reply(`o time que você está tentando entrar já está cheio!`)

        function entrar_time(time) { 
            db.set(`${message.author.id}.time_disponivel`, false)
            db.set(`${message.author.id}.time`, time)
            db.set(`${fteam}.membros_quantidade`, fteam_membros_quantidade+1)
            db.push(`${fteam}.membros`, message.author.username)
            
            fteam_convites.splice(fteam_convites.indexOf(message.author.id), 1)
            fteam_convites_ui.splice(fteam_convites_ui.indexOf(`${message.author.username} (${message.author.id})`), 1)

            db.set(`${fteam}.convites`, fteam_convites)
            db.set(`${fteam}.convites_ui`, fteam_convites_ui)

            message.reply(`você entrou em \`${time}\``)
        }

        entrar_time(fteam)
    }

    if (!args[0] && time_disponivel === true || args[0] === "ajuda") {
        let embed = new MessageEmbed()
            .setAuthor('Comandos De Time')
            .setColor("#00f4ff")
            .setDescription(
                `${prefix}time criar\n` +
                `${prefix}time deletar\n` +
                `${prefix}time ajuda\n` +
                `${prefix}time sair\n` +
                `${prefix}time depositar\n` +
                `${prefix}time bonus\n` +
                `${prefix}time melhorar\n` +
                `${prefix}time convidar\n` +
                `${prefix}time convites\n` +
                `${prefix}time cofre\n` +
                `${prefix}time entrar`
            )

        message.channel.send(message.author, embed)
        return
    }

    if (args[0] === "depositar") {
        let time = db.fetch(`${message.author.id}.time`)

        if (times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        if (!args[1]) return message.reply(`use: \`${prefix}time depositar <quantidade-de-moedas>\``)
        if (isNaN(args[1])) return message.reply(`o valor inserido precisa ser um número!`)
        if (args[1] > dbv.coins) return message.reply(`você não tem moedas suficiente para depositar!`)
        if (args[1] <= 0) return message.reply('o valor inserido precisa ser no mínimo `1`!')

        let time_cofre = db.fetch(`${time}.cofre`)

        let para_deposito = parseInt(args[1], 10)

        function depositar_time() {
            time_cofre += para_deposito
            db.set(`${time}.cofre`, time_cofre)

            dbv.coins -= para_deposito
            db.set(`${message.author.id}.coins`, dbv.coins)

            message.reply(`você depositou \`${args[1]} coins\` no cofre do time!`)
        }

        depositar_time()
        return
    }

    if (args[0] === "cofre") {
        let time = db.fetch(`${message.author.id}.time`)

        if (times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_cofre = db.fetch(`${time}.cofre`)
        let time_desconto_armas = db.fetch(`${time}.desconto_armas`)
        let time_desconto_armaduras = db.fetch(`${time}.desconto_armaduras`)
        let time_desconto_magias = db.fetch(`${time}.desconto_magias`)
        let time_bonus_xp = db.fetch(`${time}.bonus_xp`)
        let time_bonus_coins = db.fetch(`${time}.bonus_coins`)
        let time_criador_id = db.fetch(`${time}.criador_id`)

        let embed_cofre = new MessageEmbed()
            .setColor("#00f4ff")
            .setAuthor("Cofre do time")
            .setDescription(time_cofre === 0 ? '**Seu time não possui nenhuma moeda depositada no cofre!**' : `**Seu time possui \`${time_cofre} moedas\` depositadas no cofre!**`)

        message.channel.send(message.author, embed_cofre)
            .then(msg => {
                if (message.author.id !== time_criador_id) return;

                msg.react('💸')

                let f1 = (r, u) => r.emoji.name === "💸" && u.id === message.author.id;
                let c1 = msg.createReactionCollector(f1, {
                    max: 1
                })

                function sacar_cofre_time() {
                    let a, b, c, d, e = false

                    time_desconto_armas === 50 ? a = true : ''
                    time_desconto_armaduras === 50 ? b = true : ''
                    time_desconto_magias === 50 ? c = true : ''
                    time_bonus_xp === 50 ? d = true : ''
                    time_bonus_coins === 50 ? e = true : ''

                    if (a === false || b === false || c === false || d === false || e === false) return message.reply(`você ainda não pode sacar as moedas do cofre do time!\nEvolua os bônus do time ao máximo para sacar.`).then(mam => setTimeout(() => mam.delete(), 4000))
                    if (a === true && b === true && c === true && d === true && e === true) {
                        dbv.coins += time_cofre
                        db.set(`${message.author.id}.coins`, dbv.coins)
                        message.reply(`seu time tem todos os requisitos para sacar moedas, **\`${time_cofre} moedas\`** foram adicionadas na sua carteira.`)
                    }
                }

                c1.on('collect', mm => {
                    msg.reactions.removeAll()
                    sacar_cofre_time()
                })
            })
        return
    }

    if (args[0] === "convites") {
        let time = db.fetch(`${message.author.id}.time`)

        if (times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_convites = db.fetch(`${time}.convites`)
        let time_convites_ui = db.fetch(`${time}.convites_ui`)

        let embed_convites = new MessageEmbed()
            .setColor("#00f4ff")
            .setAuthor("Convites pendentes:")
            .setDescription(time_convites.length === 0 ? "Seu time não possui nenhum convite pendente!" : time_convites_ui)

        message.channel.send(message.author, embed_convites)
    }

    if (args[0] === "convidar") {
        let time = db.fetch(`${message.author.id}.time`)

        if (times_criados.indexOf(time) === -1) return message.reply('você não está em um time!')

        let time_id = db.fetch(`${time}.id`)
        let time_convites = db.fetch(`${time}.convites`)
        let time_convites_ui = db.fetch(`${time}.convites_ui`)

        if (args[1] === "excluir") {
            if (!user) return message.reply(`use: \`${prefix}time convidar excluir <@usuário>\``)
            if (time_convites.indexOf(user.user.id) === -1) return message.reply(`este usuário não foi convidado para o seu time!\nPara ver todos os convites pendentes, use: \`${prefix}time convites\``)

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

        if (!user) return message.reply(`use: \`${prefix}time convidar <@usuário>\``)
        if (times_criados.indexOf(time) === -1) return message.reply(`você precisa estar em um time para poder convidar!`)
        if (time_convites.indexOf(user.user.id) >= 0) return message.reply(`você já convidou este usuário!\nCaso queira excluir o convite, use: \`${prefix}time convidar excluir <@usuário>\``)

        let time_user = db.fetch(`${user.user.id}.time`)

        if (user.user.id === message.author.id) return message.reply('você não consegue convidar a si mesmo!')
        if (times_criados.indexOf(time_user) >= 0) return message.reply('este usuário já está em um time!')

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

    if (args[0] === "criar") {
        if (time_disponivel === false) return message.reply("você já está em um time! Saia dele antes de criar outro.")
        if (dbv.coins < 500) return message.reply('você precisa de 500 moedas para criar um time!')

        function criar_time(nome, tag) {
            let embed_criado_sucesso = new MessageEmbed()
                .setAuthor('Time criado com sucesso!')
                .addField('Nome do time:', `\`${nome}\``, true)
                .addField('TAG do time:', `\`${tag}\``, true)
                .setColor('YELLOW')
                .setDescription(`Utilize \`${prefix}time\` e veja o painel de informações do seu time!`)
                .setFooter('500 moedas foram debitadas de sua carteira.')

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

            db.set(`${nome}.desconto_armas`, 0)
            db.set(`${nome}.desconto_armaduras`, 0)
            db.set(`${nome}.desconto_magias`, 0)
            db.set(`${nome}.bonus_xp`, 0)
            db.set(`${nome}.bonus_coins`, 0)

            db.set(`${nome}.desconto_armas_p`, 200)
            db.set(`${nome}.desconto_armaduras_p`, 200)
            db.set(`${nome}.desconto_magias_p`, 200)
            db.set(`${nome}.bonus_xp_p`, 400)
            db.set(`${nome}.bonus_coins_p`, 400)

            db.set(`${nome}.desconto_armas_l`, 49)
            db.set(`${nome}.desconto_armaduras_l`, 49)
            db.set(`${nome}.desconto_magias_l`, 49)
            db.set(`${nome}.bonus_xp_l`, 49)
            db.set(`${nome}.bonus_coins_l`, 49)

            db.set(`${nome}.limite_membros_p`, 150)
            db.set(`${nome}.limite_membros_l`, 4)

            db.set(`${nome}.finalizado`, false)

            //

            db.push('times.tags', tag)
            db.push(`times.criados`, nome)
            db.set(`times.uID`, times_uID)

            db.set(`${message.author.id}.time_disponivel`, false)
            db.set(`${message.author.id}.time`, nome)

            dbv.coins -= 500
            db.set(`${message.author.id}.coins`, dbv.coins)

            message.channel.send(message.author, embed_criado_sucesso)
        }

        message.reply('qual vai ser o nome do time? (Máximo de 64 caracteres)\nEnvie "cancelar" para cancelar o processo.')
            .then(function() {
                message.channel.awaitMessages(res => message.content, {
                        max: 1,
                        time: 180000,
                        errors: ['time']
                    })
                    .then((nome_time) => {
                        if (nome_time.first().content === "cancelar") {
                            message.reply(mf["op_cancel"]).then(msg => setTimeout(() => msg.delete(), 2500))
                            return
                        }

                        if (nome_time.first().content.length > 64) {
                            message.reply('o nome do time não pode ser maior que 64 caracteres!')
                            return
                        }

                        if (nome_time.first().content.length < 2) {
                            message.reply('o nome do time precisa ser maior que 2 caracteres!')
                            return
                        }

                        if (times_criados.indexOf(nome_time.first().content) >= 0)
                            return message.reply('este nome já está em uso.')

                        message.reply('qual vai ser a TAG do time? (Máximo de 12 caracteres)\nEnvie "cancelar" para cancelar o processo.')
                            .then(function() {
                                message.channel.awaitMessages(res => message.content, {
                                        max: 1,
                                        time: 180000,
                                        errors: ['time']
                                    })
                                    .then((tag_time) => {
                                        if (tag_time.first().content === "cancelar") {
                                            message.reply(mf["op_cancel"]).then(msg => setTimeout(() => msg.delete(), 2500))
                                            return
                                        }

                                        if (tag_time.first().content.length > 12) {
                                            message.reply('a tag do time não pode ser maior que 12 caracteres!')
                                            return
                                        }

                                        if (tag_time.first().content.length < 1) {
                                            message.reply('a tag do time precisa ser maior que 1 caractere!')
                                            return
                                        }

                                        if (times_criados.indexOf(nome_time.first().content) >= 0)
                                            return message.reply('esta TAG já está em uso.')

                                        criar_time(nome_time.first().content, tag_time.first().content)
                                    })
                            })

                    })
            })

        return
    }
}