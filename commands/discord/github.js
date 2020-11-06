const { Command } = require('discord.js-commando');

module.exports = class GitHubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github',
			aliases: ['git'],
			group: 'discord',
			memberName: 'github',
            description: 'Replies with the GitHub URL',
		});
	}

	run(message) {
        message.reply('Here are the GitHub links for the project!\nGitHub: https://github.com/NumbskullStudios/BeyondBinary\nClone URL: https://github.com/NumbskullStudios/BeyondBinary.git');
    }
};