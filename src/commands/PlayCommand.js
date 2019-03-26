const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require('../../config.json')
const { URLSearchParams } = require("url");

module.exports.run = async (funo, message, args) => {
  if (!message.member.voiceChannel) {
    return message.channel.send(new Discord.RichEmbed().setDescription("**You are not in a voice channel**"))
  }

  const guildId = message.guild.id;

  const track = args.join(" ");
  const [song] = await getSongs(`ytsearch: ${track}`, funo.manager);

  if(!funo.guildQueues.has(guildId)) funo.guildQueues.set(guildId, [])

  const queue = funo.guildQueues.get(guildId);

  let player;
  if(!funo.guildPlayers.has(guildId)) {
    player = await funo.manager.join({
      guild: guildId,
      channel: message.member.voiceChannel.id,
      host: config.nodes[0].host
    }, { selfdeaf: true });

    player.on("end", async data => {
      queue.shift();

      if(queue.length) {
        const song = queue[0];
        player.play(song.track);

        return message.channel.send(`Now playing: **${song.info.title}** by *${song.info.author}*`);
      }
      
      return message.channel.send('End of queue.')
    });

    funo.guildPlayers.set(guildId, player);
  } else {
    player = funo.guildPlayers.get(guildId);
  }

  if(queue.length) {
    // Songs in queue

    queue.push(song)
    
    return message.channel.send(`Added to queue: **${song.info.title}** by *${song.info.author}*`);
  } else {
    // No songs in queue
    queue.push(song)

    player.play(song.track);

    return message.channel.send(`Now playing: **${song.info.title}** by *${song.info.author}*`);
  }
}

async function getSongs(search, manager) {
  const node = manager.nodes.first();

  const params = new URLSearchParams();
  params.append("identifier", search);

  return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, { headers: { Authorization: node.password } })
    .then(res => res.json())
    .then(data => data.tracks)
    .catch(err => {
      console.error(err);
      return null;
    });
}

module.exports.help = {
  command: "Play",
  name: "play",
  category: "music",
  description: "Play some music",
  aliases: ["p"]
};