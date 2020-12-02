const {PREFIX, TOKEN} = require('./config.json');
const Discord = require('discord.js');

const client = new Discord.Client();
client.login(TOKEN);

client.on('message', message =>
{
    if(message.author.bot || !message.content.startsWith(PREFIX)) return; //verificam sa nu fie bot si sa fie prefixul

    const args = message.content.slice(PREFIX.length).split(' ');

    console.log(args[0]);
    switch (args[0].toLowerCase()){
        case 'ping':
            message.channel.send('pong!').catch(console.error);
    }
})