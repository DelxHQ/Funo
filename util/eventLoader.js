const reqEvent = (event) => require(`../events/${event}`);
const logger = require('./logger');
const chalk = require('chalk');

module.exports = funo => {
  logger(funo, chalk.yellow('Loading Events...')).then(() => {
    funo.on('ready', () => reqEvent('ready')(funo));
    funo.on('reconnecting', () => reqEvent('reconnecting')(funo));
    funo.on('message', reqEvent('message'));
    funo.on('guildCreate', reqEvent('guildCreate'));
  });
  logger(funo, chalk.green('All events loaded!'));
};
