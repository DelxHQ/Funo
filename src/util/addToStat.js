/*
Created by: Suremeo
Date: 2/28/2019, 11:53 PM
*/

module.exports = async (bot, guild) => {
    var config = await bot.stats.ensure(guild.id, bot.defaultStats)
    if (!config.memberArray) config["memberArray"] = []
    if (!config.dateArray) config["dateArray"] = []
    var d = new Date();
    var date = await d.getMinutes().toString().split("")[0]
    if (config.dateArray[config.dateArray.length -1] != date) {
        config.dateArray.push(date)
        config.memberArray.push(guild.members.size)
    } else {
        config.memberArray[config.memberArray.length -1] = guild.members.size
    }

    bot.settings.set(guild.id, config.dateArray, "dateArray")
    bot.settings.set(guild.id, config.memberArray, "memberArray")
}