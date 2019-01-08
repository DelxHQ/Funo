const error = require('../util/errors');
const Discord = require('discord.js');

module.exports.run = (funo, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return error.noPermission(message, 'BAN_MEMBERS');
    var toBan = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if (!toBan) return error.noArgs(message);
    if (message.author.id === toBan.id) return error.useOnSelf(message, 'You cannot ban yourself!');
    if (!args[1]) return error.noArgs(message, 'You must provide the ban length (in days)');
    if (isNaN(args[1])) return error.NaN(message, 'The ban length must be a number!');
    if (!args[2]) return error.noReason(message, 'You must give a reason for banning!');

    var reason = args.slice(2).join(' ');

    if (toBan.highestRole.position >= message.member.highestRole.position) return error.userHigherRole(message);

    toBan.send(new Discord.RichEmbed()
        .setTitle('You have been banned from **' + message.guild.name + '**')
        .setColor('RED')
        .addField('By:', message.author.username)
        .addField('Reason:', '```' + reason + '```')).then(() => {
            toBan.ban({
                reason: reason,
                days: args[1]
            });
        });
    message.channel.send(new Discord.RichEmbed().setColor('GREEN').setDescription('😄 ' + toBan + ' has been banned!'));
}


module.exports.help = {
    command: "Ban",
    name: "ban"
}