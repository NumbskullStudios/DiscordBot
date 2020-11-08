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
        hacknplan.getCurrentBoard().then(boardHttpResponse => {
            return boardHttpResponse.json();
        }).then(boardData => {


            if (boardData.milestoneId && boardData.milestoneId != 0) {

                hacknplan.getMilestone(boardData.milestoneId).then(milestoneHttpResponse => {
                    return milestoneHttpResponse.json();
                }).then (milestoneData => {
                    const boardTitle = boardData.name;
                    const boardURL = `https://app.hacknplan.com/p/${config.hacknplan_project_id}/kanban?categoryId=0&boardId=${boardData.boardId}`;
                    const boardDescription = boardData.description && boardData.description.length > 0 ? boardData.description : 'No board description';
                    const boardGeneral = boardData.generalInfo && boardData.generalInfo.length > 0 ? boardData.generalInfo : 'No general info';
                    const milestoneName = milestoneData.name && milestoneData.name.length > 0 ? milestoneData.name : 'No milestone name';
                    const milestoneInfo = milestoneData.generalInfo && milestoneData.generalInfo.length > 0 ? milestoneData.generalInfo : 'No general info';
                    const boardEmbed = new Discord.MessageEmbed()
                    .setColor('GOLD')
                    .setTitle(`${boardTitle}`)
                    .setURL(boardURL)
                    .setAuthor(this.client.user.tag, this.client.user.avatarURL(), '')
                    .setDescription(boardDescription)
                    .addField('Board Info', boardGeneral, false)
                    .addField('Part of: ' + milestoneName, milestoneInfo);
    
                    message.channel.send(boardEmbed);
                });
            } else {
                const boardTitle = boardData.name;
                const boardURL = `https://app.hacknplan.com/p/${config.hacknplan_project_id}/kanban?categoryId=0&boardId=${boardData.boardId}`;
                const boardDescription = boardData.description && boardData.description.length > 0 ? boardData.description : 'No board description';
                const boardGeneral = boardData.generalInfo && boardData.generalInfo.length > 0 ? boardData.generalInfo : 'No general info';
                const boardEmbed = new Discord.MessageEmbed()
                .setColor('GOLD')
                .setTitle(`${boardTitle}`)
                .setURL(boardURL)
                .setAuthor(this.client.user.tag, this.client.user.avatarURL(), '')
                .setDescription(boardDescription)
                .addField('General Info', boardGeneral, false);
    
                message.channel.send(boardEmbed);
            }

            
        });
    }
};
    
