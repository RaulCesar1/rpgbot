const { Discord, Client, MessageEmbed } = require('discord.js');
const client = new Client();
const configFile = require('./utils/configs/config.json');
const token = configFile.token;
const botID = configFile.botID;
const prefix = configFile.prefix;
const db = require('quick.db')
const msgsFile = require('./utils/configs/messages.json')

client.login(token)

client.on('ready', () => {
    console.log("RPG online!")
})

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

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

    if(!message.content.startsWith(prefix)) {
      if(jornada === true) {
        xp += 1
        if(xp >= 250) {
          nivel += 1
          db.set(`${message.author.id}.xp`, 0)
          db.set(`${message.author.id}.nivel`, nivel)
          limite_itens += 10
          db.set(`${message.author.id}.limite_itens`, limite_itens)

          if(limite_carteira - coins === 0) {
            let paraBanco = 250
            banco_coins += paraBanco

            db.set(`${message.author.id}.banco_coins`, banco_coins)

            let embed = new MessageEmbed()
            .setAuthor(`Você upou de nível!`)
            .setDescription(`**\`${nivel - 1} --> ${nivel}\`**`)
            .addField('Recompensas:', `Limite de itens no inventário aumentado para **\`${limite_itens}!\`**\n**\`250 coins\`** foram adicionados na sua conta do banco!`)
            .setColor("#51f1ff")
            message.channel.send(message.author, embed)
          } else if(limite_carteira - coins < 250) {
            let diferenca = limite_carteira - coins
            let paraBanco = 250 - diferenca

            coins += diferenca
            banco_coins += paraBanco

            db.set(`${message.author.id}.coins`, coins)
            db.set(`${message.author.id}.banco_coins`, banco_coins)

            let embed = new MessageEmbed()
            .setAuthor(`Você upou de nível!`)
            .setDescription(`**\`${nivel - 1} --> ${nivel}\`**`)
            .addField('Recompensas:', `Limite de itens no inventário aumentado para **\`${limite_itens}!\`**\n**\`${paraBanco} coins\`** foram adicionados na sua conta do banco!\n**\`${diferenca} coins\`** foram adicionados na sua carteira!`)
            .setColor("#51f1ff")
            message.channel.send(message.author, embed)
          } else {
            coins += 250
            db.set(`${message.author.id}.coins`, coins)

            let embed = new MessageEmbed()
            .setAuthor(`Você upou de nível!`)
            .setDescription(`**\`${nivel - 1} --> ${nivel}\`**`)
            .addField('Recompensas:', `Limite de itens no inventário aumentado para **\`${limite_itens}!\`**\n**\`250 coins\`** foram adicionados na sua carteira!`)
            .setColor("#51f1ff")
            message.channel.send(message.author, embed)
          }
          return
        }
        db.set(`${message.author.id}.xp`, xp)
      }
      return
    }
  
    var comando = message.content.toLowerCase().split(' ')[0];
    comando = comando.slice(prefix.length);
  
    var args = message.content.split(' ').slice(1);
  
    try {
      let acmd = require(`./comandos/${comando}.js`);
      acmd.run(client, message, args);
    }catch(e) {
      console.log(e)
    }
  })