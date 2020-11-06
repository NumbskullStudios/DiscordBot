const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const config = require('../../config.json');
const data = require('../../data');

module.exports = class SoundCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sound',
			aliases: ['audio', 'music'],
			group: 'discord',
			memberName: 'sound',
            description: 'Copies an audio file into the archive channel',
		});
	}

	run(message) {

        // MUST have an image attached
        if (message.attachments.size === 0) {
            message.say('The art command must be used with an image');
        }
        else {

            this.client.settings.ensure(message.guild.id, defaultSettings);

            const imageChannel = this.client.settings.get(message.guild.id, "imageChannel");

            if (!imageChannel) {
                message.reply('Image channel not set!');
                return;
            }

            const imageURL = message.attachments.array()[0].url;

            const title = 'Sound';

            const userURL = message.author.avatarURL();

            const embedMessage = new Discord.MessageEmbed()
	            .setColor('BLUE')
	            .setTitle(title)
	            .setAuthor(message.author.tag, userURL, '')
                .setDescription('🔈 ' + message.author.username + ' uploaded an audio file in ' + message.channel.toString() + ' 🔈')
                .attachFiles(message.attachments.array()[0].url)
	            .setTimestamp()
	            .setFooter('Posted at:', '');

                this.client.channels.fetch(imageChannel).then(channel => channel.send(embedMessage)).catch(e => message.say('James is dumb and needs to set the channel'))
        }
    }
};