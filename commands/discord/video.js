const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const config = require('../../config.json');
const data = require('../../data');

module.exports = class VideoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'video',
			aliases: ['video', 'movie'],
			group: 'discord',
			memberName: 'video',
            description: 'Copies a video file into the archive channel',
		});
	}

	run(message) {

        // MUST have an image attached
        if (message.attachments.size === 0) {
            message.say('The video command must be used with an attachment');
        }
        else {

            this.client.settings.ensure(message.guild.id, defaultSettings);

            const imageChannel = this.client.settings.get(message.guild.id, "imageChannel");

            if (!imageChannel) {
                message.reply('Archive channel not set!');
                return;
            }

            const imageURL = message.attachments.array()[0].url;

            const title = 'Video';

            const userURL = message.author.avatarURL();

            message.reply(imageURL);

            const embedMessage = new Discord.MessageEmbed()
	            .setColor('BLUE')
	            .setTitle(title)
	            .setAuthor(message.author.tag, userURL, '')
                .setDescription('🔈 ' + message.author.username + ' uploaded a video in ' + message.channel.toString() + ' 🔈')
                .setImage(imageURL)
	            .setTimestamp()
                .setFooter('Posted at:', '');
                
                embedMessage.type = 'video';

                this.client.channels.fetch(imageChannel).then(channel => channel.send(embedMessage)).catch(e => message.say('James is dumb and needs to set the channel'))
        }
    }
};