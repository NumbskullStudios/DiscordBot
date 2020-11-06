const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const config = require('../../config.json');
const hacknplan = require('../../hacknplan');

module.exports = class CurrentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'current',
			group: 'hacknplan',
			memberName: 'current',
            description: 'Shows info about the current board',
		});
	}

	run(message) {
        var response = hacknplan.fetchHacknPlan(config.hacknplan_project, 'GET').then(response => {
                return response.json();
            }).then(result => {

                if (!result || !result.defaultBoardId) {
                    message.reply('Sorry! I couldn\'t find the default board');
                    return;
                }

                var currentBoardID = result.defaultBoardId;

                var board = hacknplan.fetchHacknPlan(config.hacknplan_project + '/boards/' + currentBoardID, 'GET').then(boardResponse => {
                    return boardResponse.json();
                }).then(boardResult => {

                const boardTitle = boardResult.name;
                const boardURL = `https://app.hacknplan.com/p/${config.hacknplan_project_id}/kanban?categoryId=0&boardId=${boardResult.boardId}`;
                const boardDescription = boardResult.description && boardResult.description.length > 0 ? boardResult.description : 'No board description';

                const boardEmbed = new Discord.MessageEmbed()
                .setColor('GOLD')
                .setTitle(`${boardTitle}`)
                .setURL(boardURL)
                .setAuthor(this.client.user.tag, this.client.user.avatarURL(), '')
                .setDescription(boardDescription);

                message.channel.send(boardEmbed);
                })
            });
    }
};
    
