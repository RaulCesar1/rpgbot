const { Discord, Client, MessageEmbed } = require('discord.js');
const client = new Client();
const configFile = require('./utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const db = require('quick.db')

const rpg_config = require('./utils/configs/rpg_config.json')
const max_level = rpg_config.max_level
const up_xp = rpg_config.up_xp
const msg_xp = rpg_config.msg_xp

client.login(token)

client.on('ready', () => {
    console.log("RPG online!")
})

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    var prefix = await db.fetch(`${message.guild.id}.prefix`)
    var coins = await db.fetch(`${message.author.id}.coins`)
    var banco_coins =  await db.fetch(`${message.author.id}.banco_coins`)
    var limite_carteira = await db.fetch(`${message.author.id}.limite_carteira`)
    var nivel = await db.fetch(`${message.author.id}.nivel`)
    var xp = await db.fetch(`${message.author.id}.xp`)
    var limite_itens = await db.fetch(`${message.author.id}.limite_itens`)
    var inventario_itens = await db.fetch(`${message.author.id}.inventario_itens`)
    var arma_equipada = await db.fetch(`${message.author.id}.arma_equipada`)
    var armadura_equipada = await db.fetch(`${message.author.id}.armadura_equipada`)
    var magias_equipadas = await db.fetch(`${message.author.id}.magias_equipadas`)
    var magias = await db.fetch(`${message.author.id}.magias`)
    var armaduras = await db.fetch(`${message.author.id}.armaduras`)
    var armas = await db.fetch(`${message.author.id}.armas`)
    var jornada = await db.fetch(`${message.author.id}.jornada`)
    var idm = await db.fetch(`${message.guild.id}.idm`)
    var manutencao = await db.fetch('manutencao')
    var frags = await db.fetch(`${message.author.id}.frags`)
    if(!idm) {await db.set(`${message.guild.id}.idm`, 'en')}
    if(!prefix) {await db.set(`${message.guild.id}.prefix`, '!')}

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
      max_level: max_level,
      up_xp: up_xp,
      msg_xp: msg_xp
    }
    
    if(message.content.startsWith(`<@${botID}>`) || message.content.startsWith(`<@!${botID}>`))
      return message.reply(mf["bot_mention"].replace('{prefix}', prefix))

    if(!message.content.startsWith(prefix)) {
      if(jornada === true) {
        xp += msg_xp

        if(xp >= up_xp) {

          if(nivel === max_level) return;

          nivel += 1
          db.set(`${message.author.id}.xp`, 0)
          db.set(`${message.author.id}.nivel`, nivel)
          limite_itens += 10
          db.set(`${message.author.id}.limite_itens`, limite_itens)

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