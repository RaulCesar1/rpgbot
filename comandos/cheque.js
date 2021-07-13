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

    if(!args[0]) return message.reply(`use: \`${prefix}cheque usar/criar/disponivel\``)

    var cheques_criados = db.fetch('cheques.criados')

    if(args[0] === "criar" || args[0] === "create") {
        if(!args[1]) return message.reply(`use: \`${prefix}cheque criar <quantidade de coins>\``)

        if(isNaN(args[1])) return message.reply('o valor inserido precisa ser um número!')
        if(args[1] <= 0) return message.reply('o número inserido precisar ser no mínimo `1`!')
        if(args[1] > dbv.coins) return message.reply('você não tem a quantidade de coins suficiente para realizar esta transação!')

        function criar_cheque() {
            let lista = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
            let codigo_gerado = ""

            for(i = 0; i < 23; i++) {
                let r = lista.charAt(Math.floor(Math.random() * lista.length))
                codigo_gerado+=r
                if(codigo_gerado.length === 5 || codigo_gerado.length === 11 || codigo_gerado.length === 16 || codigo_gerado.length === 21) {
                    codigo_gerado+="-"
                }
            }

            if(cheques_criados.indexOf(codigo_gerado) >= 0) return criar_cheque()

            db.push('cheques.criados', codigo_gerado)
            db.push(`cheques.${message.author.id}`, codigo_gerado)
            db.set(`${codigo_gerado}.valor`, args[1])
            db.set(`${codigo_gerado}.criador`, message.author.id)

            let valor_sub = parseInt(args[1], 10)
            
            dbv.coins -= valor_sub
            db.set(`${message.author.id}.coins`, dbv.coins)

            return codigo_gerado
        }

        try {
            let embed = new MessageEmbed()
            .setAuthor('Cheque criado com sucesso!')
            .setDescription(`**${args[1]} coins**`)
            .addField('Código do cheque:', `\`${criar_cheque()}\`\n\n**Utilize: \`${prefix}cheque usar <código do cheque>\`**`)
            .setColor("BLUE")

            message.author.send(embed).catch(() => {message.reply(`não possível enviar o código para o seu DM! Ative as mensagens diretas e use: \`${prefix}cheque disponivel\``); return});
            message.delete()
            message.reply('cheque criado com sucesso! Verifique seu DM.')
        } catch(e) {
            console.log(e)
        }
    }

    if(args[0] === "usar" || args[0] === "use") {
        message.delete()
        if(!args[1]) return message.reply(`use: \`${prefix}cheque usar <código do cheque>\``)

        if(cheques_criados.indexOf(args[1]) === -1) {
            message.reply(`este código não existe! Verifique se digitou corretamente.`)
            return
        } 

        let valor_cheque = parseInt(db.fetch(`${args[1]}.valor`), 10)
        let id_criador_cheque = db.fetch(`${args[1]}.criador`)
        var array_cheques_criador = db.fetch(`cheques.${id_criador_cheque}`)

        try {
            cheques_criados.splice(cheques_criados.indexOf(args[1]), 1)

            db.set('cheques.criados', cheques_criados)

            array_cheques_criador.splice(array_cheques_criador.indexOf(args[1]), 1)

            db.set(`cheques.${id_criador_cheque}`, array_cheques_criador)

            db.delete(`${args[1]}.valor`)
            db.delete(`${args[1]}.criador`)

            if((dbv.coins + valor_cheque) > dbv.limite_carteira) {
                let resto = (dbv.coins + valor_cheque) - dbv.limite_carteira 
                let carteira = (dbv.coins + valor_cheque) - resto                                                    

                db.set(`${message.author.id}.coins`, carteira)

                dbv.banco_coins += resto
                db.set(`${message.author.id}.banco_coins`, dbv.banco_coins)

                let embed = new MessageEmbed()
                .setAuthor(`Cheque utilizado com sucesso! (${valor_cheque} coins)`)
                .setColor("YELLOW")
                .setDescription(`**\`${valor_cheque-resto}\` coins foram adicionados na sua carteira.**\n**\`${resto}\` coins foram adicionados na sua conta do banco.**`)
                .setFooter("Sua carteira atingiu o limite de coins!")
    
                message.channel.send(message.author, embed)
            } else {
                dbv.coins += valor_cheque
                db.set(`${message.author.id}.coins`, dbv.coins)

                let embed = new MessageEmbed()
                .setAuthor(`Cheque utilizado com sucesso! (${valor_cheque} coins)`)
                .setColor("YELLOW")
                .setDescription(`**\`${valor_cheque}\` coins foram adicionados na sua carteira!**`)
    
                message.channel.send(message.author, embed)
            }
            
        }catch(e){
            console.log(e)
            message.reply('não foi possível utilizar este cheque!')
        }
    }

    if(args[0] === "disponiveis" || args[0] === "disponivel" || args[0] === "available") {
        let cheques_disponiveis = db.fetch(`cheques.${message.author.id}`)

        if(cheques_disponiveis.length===0) {
            message.reply('você não tem nenhum cheque disponível!')            
            return
        }

        try {
            let embed = new MessageEmbed()
            .setAuthor("Cheques disponíveis")
            .setDescription(cheques_disponiveis)
            .setColor("RED")
    
            message.author.send(embed).catch(() => {message.reply(`não possível enviar o código para o seu DM! Ative as mensagens diretas e tente usar o comando novamente.`); return});
            message.reply('verifique seu DM!')
        } catch(e){
            console.log(e)
        }
    }
}