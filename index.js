const config = require('./config.json');
const secret = require('./secret.json');
const data = require('./data');

const Discord = require('discord.js');
const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const hacknplan = require('./hacknplan');

const client = new CommandoClient({
    commandPrefix: '!',
    owner: '170901442524086273',
    invite: 'https://discord.gg/6etZtzbChz'
});

const Enmap = require('enmap');

client.settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['hacknplan', 'Connect to HacknPlan from Discord to view, edit, create or delete tasks'],
        ['discord', 'Commands to make using Discord a little easier'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on("guildDelete", guild => {
    // When the bot leaves or is kicked, delete settings to prevent stale entries.
    client.settings.delete(guild.id);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('Beyond Binary');
});

client.on('error', console.error);

client.on('message', message => {

    // Never listen to bots
    if (!message.guild || message.author.bot) {
        return;
    }

    // If the message contains a task ID (#502 , for example)
    if (message.content.includes('#')) {
        // Use regex to find all instances of task ids
        // \d finds a digit
        // + finds all digits until it can't find anymore
        // g sets the global flag. This gets ALL matches
        const taskIDs = message.content.match(/#\d+/g);

        // Create an embed for every task we found
        for (var i = 0; i < taskIDs.length; i++) {
            const taskID = taskIDs[i];

            hacknplan.getTask(taskID.slice(1)).then(response => {
                return response.json();
            }).then(result => {

                if (!result || !result.board || !result.board.boardId) {
                    message.channel.send('Sorry! I can\'t find that HacknPlan task');
                    return;
                }

                const description = result.description.length > 0 ? result.description : 'No task description';

                const taskURL = `https://app.hacknplan.com/p/${config.hacknplan_project_id}/kanban?categoryId=${result.category.categoryId}&boardId=${result.board.boardId}&taskId=${taskID.slice(1)}`;

                const taskEmbed = new Discord.MessageEmbed()
                .setColor('GOLD')
                .setTitle(`${taskID} | ${result.title}`)
                .setURL(taskURL)
                .setAuthor(client.user.tag, client.user.avatarURL(), '')
                .setDescription(description);

                if (result.picture) {
                    taskEmbed.setThumbnail(result.picture.file.url);
                }

                var usersList = '';
                var tagsList = '';

                for (var user = 0; user < result.assignedUsers.length; user++) {

                    if (user == 0) {
                        usersList += result.assignedUsers[user].user.username;
                    }
                    else {
                        usersList += ', ' + result.assignedUsers[user].user.username;
                    }
                }

                for (var tag = 0; tag < result.tags.length; tag++) {

                    if (tag == 0) {
                        tagsList += result.tags[tag].name;
                    }
                    else {
                        tagsList += ', ' + result.tags[tag].name;
                    }
                }

                taskEmbed.addField('Stage', result.stage.name, false);

                taskEmbed.addField('Users', usersList.length > 0 ? usersList : 'No users', false);
                   
                taskEmbed.addField('Tags', tagsList.length > 0 ? tagsList : 'No tags', false);
                
                message.channel.send(taskEmbed);

                console.log(result.importanceLevel.importanceLevelId);

            }).catch(e => console.log(e));
        }
    }
});

client.login(secret.discord_token);