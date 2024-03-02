const { Player } = require('discord-player');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('node:path');
dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
// create collections for client
client.commands = new Collection();
client.cooldowns = new Collection();

const commandFolders = fs.readdirSync(path.join(__dirname, 'src/commands'));

for (const folder of commandFolders) {
	console.log(`Loading commands from ${folder}`);
	const commandFiles = fs.readdirSync(path.join(__dirname, `src/commands/${folder}`)).filter(file => file.endsWith('.js'));
	console.log(`|---Found ${commandFiles.length} commands`);
	commandFiles.forEach(file => {
		console.log(`	|---Loading command ${file}`);
		const command = require(path.join(__dirname, `src/commands/${folder}/${file}`));
		if (!command.data && !command.execute) {
			console.log(`		|---Command ${file} is missing data or execute method`);
			return;
		}
		client.commands.set(command.data.name, command);
		console.log(`		|---Command ${file} loaded`);
	});

}

const eventFiles = fs.readdirSync(path.join(__dirname, 'src/events')).filter(file => file.endsWith('.js'));
console.log(`Loading ${eventFiles.length} events`);

eventFiles.forEach(file => {
	console.log(`|---Loading event ${file}`);
	const event = require(path.join(__dirname, `src/events/${file}`));
	if (!event.name || !event.execute) {
		console.log(`	|---Event ${file} is missing name or execute method`);
		return;
	}
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
	console.log(`	|---Event ${file} loaded`);
});

client.on('error', (error) => {
	console.log(error.message);
});

client.asyncFunctions = new Collection();
client.player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
	},
});

client.player.extractors.loadDefault();
client.login(process.env.TOKEN);
