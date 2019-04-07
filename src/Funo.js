const Discord = require("discord.js");
const Enmap = require("enmap");
const config = require(process.env.CONFIG_LOCATION || "../config.json");
const loader = require("./util/CommandLoader");
const lavalink = require("discord.js-lavalink");

const funo = new Discord.Client({disableEveryone: true});


;(async () => {
  const start = Date.now();

  funo.logger = require("./util/Logger");

  require("./util/EventLoader")(funo);
  loader.load(funo);

  await funo.login(config.token).then(() => {
    const finish = Date.now() - start;
    funo.logger.info(`Done! (${Math.floor(finish / 10)}ms)`);

    loader.initCmds(funo);
  });


  funo.manager = new lavalink.PlayerManager(funo, config.nodes, {
    user: funo.user.id,
    shards: 0
  });

  funo.guildPlayers = new Map();
  funo.guildQueues = new Map();

  funo.settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep"
  });

  funo.stats = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep"
  });

  funo.defaultSettings = {
    prefix: ".",
    logChannel: "mod-logs"
  };

  require("./util/LavaLink")(funo);
})()
