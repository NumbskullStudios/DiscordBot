const { Command } = require('discord.js-commando');
const config = require('../../config.json');
const data = require('../../data');

module.exports = class ChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'channel',
			group: 'discord',
			memberName: 'channel',
            description: 'Sets the channel used for the `!art` command',
            args: [
				{
					key: 'channel',
					prompt: 'Which channel do you want the bot to send images to?',
					type: 'channel',
				},
			],
		});
	}

	run(message, { channel }) {
        this.client.settings.ensure(message.guild.id, defaultSettings);

        this.client.settings.set(message.guild.id, channel.id, 'imageChannel');

        message.say('Bot will send imags to: ' + this.client.settings.get(message.guild.id, 'imageChannel').toString());
    }
};

