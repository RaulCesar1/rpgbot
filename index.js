const { Discord, Client, MessageEmbed } = require('discord.js');
const client = new Client();
const configFile = require('./utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const db = require('quick.db')

client.login(token)

var m_recente = []

var times_uID = db.fetch(`times.uID`)
var times_criados = db.fetch('times.criados')

var cheques_criados = db.fetch('cheques.criados')

var manutencao = db.fetch('manutencao')

if(!cheques_criados || cheques_criados===0 || cheques_criados===null || cheques_criados===undefined) { db.set(`cheques.criados`, [])}
if(!times_uID || times_uID===null || times_uID===undefined) { db.set(`times.uID`, 0)}
if(!times_criados || times_criados===0 || times_criados===null || times_criados===undefined) { db.set(`times.criados`, [])}

client.on('ready', () => {  
    console.log("RPG online!")
})

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    // Sistema de Cooldown

 /*    if(m_recente.indexOf(message.author.id) === -1) {
      m_recente.push(message.author.id)
      setTimeout(function(){m_recente.splice(m_recente.indexOf(message.author.id), 1)}, 2000)
    } else {
      message.reply('você está em cooldown, aguarde 2 segundos.')
      return
    } */

    // Variáveis do Bot

    var prefix = db.fetch(`${message.guild.id}.prefix`)

    var coins = db.fetch(`${message.author.id}.coins`)
    var banco_coins =  db.fetch(`${message.author.id}.banco_coins`)
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
    var idm = db.fetch(`${message.author.id}.idm`)
    var frags = db.fetch(`${message.author.id}.frags`)
    var up_xp = db.fetch(`${message.author.id}.up_xp`)
    var msg_xp = db.fetch(`${message.author.id}.msg_xp`)
    var mentions = db.fetch(`${message.author.id}.mentions`)

    if(!idm || idm===false) {await db.set(`${message.author.id}.idm`, 'pt')}
    if(!prefix || prefix===false) {await db.set(`${message.guild.id}.prefix`, 'r!')}

    const mf = require(`./utils/idiomas/${idm}.json`)

    module.exports = {
      coins: coins,
      banco_coins: banco_coins,
      limite_carteira: limite_carteira,
      nivel: nivel,
      xp: xp,
      limite_itens: limite_itens,
      inventario_itens: inventario_itens,
      arma_equipada: arma_equipada,
      armadura_equipada: armadura_equipada,
      magias_equipadas: magias_equipadas,
      magias: magias,
      armaduras: armaduras,
      armas: armas,
      jornada: jornada,
      manutencao: manutencao,
      idm: idm,
      frags: frags,
      prefix: prefix,
      up_xp: up_xp,
      msg_xp: msg_xp,
      mentions: mentions
    }
    
    // Mensagem ao mencionar o bot

    if(message.content.startsWith(`<@${botID}>`) || message.content.startsWith(`<@!${botID}>`))
      return message.reply(mf["bot_mention"].replace('{prefix}', prefix))

    // Sistema de XP

    if(!message.content.startsWith(prefix)) {
      if(jornada === true) {
        xp += msg_xp

        if(xp >= up_xp) {
          nivel += 1
          db.set(`${message.author.id}.xp`, 0)
          db.set(`${message.author.id}.nivel`, nivel)

          limite_itens += 10
          db.set(`${message.author.id}.limite_itens`, limite_itens)

          up_xp += 10
          db.set(`${message.author.id}.up_xp`, up_xp)

          banco_coins += 250
          db.set(`${message.author.id}.banco_coins`, banco_coins)

          let embed = new MessageEmbed()
          .setAuthor(mf["index_1"])
          .setDescription(`**\`${nivel-1} ➠ ${nivel}\`**`)
          .addField(mf["index_2"],
            mf["index_3"].replace('{limite_itens}', limite_itens)+'\n'+
            mf["index_4"].replace('{prefix}', prefix)
          )
          .setColor("#51f1ff")

          message.channel.send(message.author, embed)

          return
        }
        
        db.set(`${message.author.id}.xp`, xp)
      }
      return
    }

    // Command Handler/Tradução de comandos
  
    var comando = message.content.toLowerCase().split(' ')[0];
    comando = comando.slice(prefix.length);
  
    var args = message.content.split(' ').slice(1);

    var carregarComando;

    comando==="journey"?carregarComando="jornada":''
    comando==="forge"?carregarComando="forja":''
    comando==="prefixo"?carregarComando="prefix":''
    comando==="bank"?carregarComando="banco":''
    comando==="moedas"?carregarComando="coins":''
    comando==="maintenance"?carregarComando="manutencao":''
    comando==="inventory"?carregarComando="inventario":''
    comando==="check"?carregarComando="cheque":''

    if(carregarComando) {
      let acmd = require(`./comandos/${carregarComando}.js`)
      acmd.run(client, message, args, comando);
      return
    }
  
    try {
      let acmd = require(`./comandos/${comando}.js`);
      acmd.run(client, message, args, comando);
    }catch(e) {
      console.log(e)
    }

})