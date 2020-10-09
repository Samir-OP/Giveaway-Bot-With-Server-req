const Discord = require('discord.js');
const bot = new Discord.Client();
const db = require('./database.js');
const ms = require('ms');
const { GiveawaysManager } = require('discord-giveaways');

const manager = new GiveawaysManager(bot, {
    storage: "./give.json",
    updateCountdownEvery: 10000, // Means 10 seconds
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "RED",
        reaction: "🎉"
    }
})
bot.giveawaysManager = manager;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageReactionAdd', async(messageReaction, user) => {
    if(user.bot) return;
    if(messageReaction.emoji.name === '🎉') {

        let serverID = await db.get(`server_${messageReaction.message.channel.id}`)
        //for(i=0; i<serverID.length; i++) { // This is loop function
            console.log(user.id)
            //let Server_ID = bot.guilds.cache.get(i)
            let User_IN_server = bot.guilds.cache.get(serverID).members.cache.get(user.id)

            if(User_IN_server) {
                user.send(`You entry approved!`)
            } else {
                messageReaction.users.remove(user.id)
                user.send(`You entry not approved!`)
            }

        //}

    } else {
        return console.log('oi')
    }
});



bot.on('message', async message => {
    let prefix = "!"
    const ms = require("ms"); 
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
 
    if(command === "gstart"){

        let time = ms(args[0]);
        let prize = args.slice(3).join(" ");
        let winners = parseInt(args[2]);
        let server_link = args[1];

        bot.fetchInvite(server_link).then(async(invite) => {
            console.log(invite.guild.id)
            let bot_is_in_server = bot.guilds.cache.get(invite.guild.id)
            if(!bot_is_in_server) {
                return message.channel.send(`Sorry, But i am not in that server!`)
            }
            let Here = await db.get(`server_${message.channel.id}`)
            if(Here === invite.guild.id) {
            } else {
                db.add(`server_${message.channel.id}`, invite.guild.id) //Here we wil add Server id in database
            }

        bot.giveawaysManager.start(message.channel, {
            time: time,
            prize: prize,
            winnerCount: winners,
            messages: {
                giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
                giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
                timeRemaining: "Time remaining: **{duration}**!",
                inviteToParticipate: `Must be the member of ${bot.guilds.cache.get(invite.guild.id).name}`,
                winMessage: "Congratulations, {winners}! You won **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: "Giveaway cancelled, no valid participations.",
                hostedBy: "Hosted by: {user}",
                winners: "winner(s)",
                endedAt: "Ended at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                }
            }
        })
   
    })
    }

});

bot.login('Bot Token');