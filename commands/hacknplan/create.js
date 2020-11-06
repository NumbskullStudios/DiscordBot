const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const config = require('../../config.json');
const hacknplan = require('../../hacknplan');

module.exports = class CreateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'create',
			group: 'hacknplan',
			memberName: 'create',
			aliases: ['bug', 'task'],
			description: 'Creates a new HacknPlan task in the backlog',
			args: [
                {
                    key: 'title',
                    prompt: 'What should the title of the task be?',
                    type: 'string',
                },
                {
                    key: 'description',
                    prompt: 'What should the description of the task be?',
                    type: 'string',
                },
            ],
		});
	}

	run(message, {title, description} ) {

		// We're going to store a list of categories here to later reference when creating the task
		let categories;

		hacknplan.fetchHacknPlan(`${config.hacknplan_project}/categories`, 'GET').then(response => { return response.json(); }).then(result => {
			categories = result;

			var returnMessage = 'Please choose a category: ';
			for (var i = 0; i < categories.length; i++) {
				returnMessage += `\n**[${i}]** ${categories[i].name}`;
			}

			message.reply(returnMessage);

			const filter = m => m.author.id === message.author.id;
			const collector = message.channel.createMessageCollector(filter, { time: 30000 , max: 1});

			collector.on('collect', m => {
				message.reply(`Thank you! You created a task with these details:\n\n**Title:** ${title}\n**Description:** ${description}\n**Category:** ${categories[m].name}\n\nSending the request to HacknPlan now...`);

				const hacknplanTask = JSON.stringify({
					"title": title,
					"description": description,
					"parentId": null,
					"isStory": false,
					"categoryId": categories[m].categoryId,
					"estimatedCost": null,
					"importanceLevelId": 3,
					"boardId": null,
					"designElementId": null,
					"startDate": null,
					"dueDate": null,
					"assignedUserIds": null,
					"tagIds": null,
					"subTasks": null,
					"dependencyIds": null
				});

				hacknplan.postHacknPlan(config.hacknplan_project + '/workitems', 'POST', hacknplanTask).then(result => message.reply(`Hacknplan responsed with: ${result.status} - ${result.statusText}`)).catch(e => message.reply(e));
			});
		});
    }
};
    
