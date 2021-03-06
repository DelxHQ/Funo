import { Collection } from 'discord.js'
import Logger from './Logger'
import fs from 'fs'

const logger = new Logger()

module.exports.load = funo => {
  funo.commands = new Collection();
  funo.aliases = new Collection();

  fs.readdir(`${__dirname}/../commands`, (e, files) => {
    if (e) {
      logger.error(e);
    }

    const commands = files.filter(f => f.split('.').pop() === 'js');
    if (commands.length <= 0) {
      logger.info('No commands to load!');
      return;
    }

    commands.forEach(async cmd => {
      let props = require(`../commands/${cmd}`);
      if (props.help.disabled) {
      } else {
        funo.commands.set(props.help.name.toLowerCase(), props);
        props.help.aliases.forEach((alias) =>
          funo.aliases.set(alias, props.help.name.toLowerCase())
        )
      }
    });
    logger.info('All commands loaded!');
  });
};

module.exports.initCmds = async funo => {
  for (const [name, cmd] of funo.commands) {
    if (typeof cmd.init === 'function') await cmd.init(funo);
  }
}
