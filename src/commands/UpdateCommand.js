const Discord = require('discord.js')
const config = require('../../config.json')
const logger = require('../util/logger')

const exec = require('child_process').exec;
let child;

module.exports.run = async (funo, message) => {

  if (message.author.id != config.ownerid) return

  message.channel.send(new Discord.RichEmbed()
    .setColor('BLUE')
    .setDescription('Updating to the latest version...')
    .setTimestamp()
  )
  // execute `git pull`
  child = exec('git pull', function (error, stdout, stderr) {
    message.channel.send('**`OUTPUT:`**\n```' + stdout + '```')
    if (error !== null) {
      logger.error('exec error: ' + error);
    } else {
      message.channel.send(new Discord.RichEmbed()
        .setColor('GREEN')
        .setDescription('Done! Restarting to apply changes...')
        .setTimestamp()
      )
    }
  })
  // this deffo needs to be changed.
  setTimeout(() => {
    process.exit()
  }, 1000 * 5)
}

module.exports.help = {
  command: "Update",
  name: "update",
  description: "Update Funo to the latest version."
}