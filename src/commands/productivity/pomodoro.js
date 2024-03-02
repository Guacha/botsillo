const { Collection, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Pomodoro = require('../../utils/pomodoro');

const pomodoroSessionsEmbed = (pomodoroSessions) => {
	const embed = new EmbedBuilder()
		.setTitle('Sesiones Pomodoro en curso')
		.setDescription('Estas son las sesiones de Pomodoro en curso en este servidor')
		.setColor('#FF5733');
	if (pomodoroSessions.length === 0) embed.addFields({ name: 'No hay sesiones', value: 'No hay, no existe' });
	pomodoroSessions.forEach(pomodoro => {
		embed.addFields({ name: 'Usuario', value: `<@${pomodoro.user}>`, inline: true }, { name: 'Estado', value: pomodoro.currentStatus, inline: true }, { name: 'Ciclo', value: `${pomodoro.currentCycle}/${pomodoro.cycles}`, inline: true });
	});
	return embed;
};

const getPomodoroSessionsForGuild = (client, guildId) => {
	if (!client.asyncFunctions.has(guildId)) {
		client.asyncFunctions.set(guildId, []);
	}
	return client.asyncFunctions.get(guildId).filter(pomodoro => pomodoro instanceof Pomodoro);
};

const createPomodoro = async (interaction, workTime, breakTime, sessionTime) => {
	const client = interaction.client;
	if (!client.asyncFunctions.has(interaction.guild.id)) {
		client.asyncFunctions.set(interaction.guild.id, []);
	}
	if (getPomodoroSessionsForGuild(client, interaction.guild.id).find(pomodoro => pomodoro.user === interaction.user.id)) {
		await interaction.reply('Ya tienes una sesión de Pomodoro en curso. Usa /pomodoro cancelar para cancelarla.');
		return;
	}

	const pomodoro = new Pomodoro(workTime, breakTime, sessionTime, interaction.client, interaction.guild.id, interaction.channel.id, interaction.user.id);

	client.asyncFunctions.get(interaction.guild.id).push(pomodoro);
	pomodoro.start();
};

module.exports = {
	data: new SlashCommandBuilder().setName('pomodoro').setDescription('Maneja sesiones de pomodoro')
		.addSubcommand(subcommand => subcommand
			.setName('crear')
			.setDescription('Crea una nueva sesión de pomodoro')
			.addIntegerOption(option => option.setName('tiempo_productivo').setDescription('Tiempo productivo en minutos').setRequired(true))
			.addIntegerOption(option => option.setName('tiempo_descanso').setDescription('Tiempo de descanso en minutos').setRequired(true))
			.addIntegerOption(option => option.setName('repeticiones').setDescription('Cantidad de repeticiones del ciclo produccion-descanso')),
		)
		.addSubcommand(subcommand => subcommand
			.setName('cancelar')
			.setDescription('Cancela tu sesión de pomodoro en curso dentro de este servidor'),
		)
		.addSubcommand(subcommand => subcommand
			.setName('sesiones')
			.setDescription('Muestra las sesiones de pomodoro en curso en este servidor'),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'crear') {
			const workTime = interaction.options.getInteger('tiempo_productivo');
			const breakTime = interaction.options.getInteger('tiempo_descanso');
			const sessionTime = interaction.options.getInteger('repeticiones') || 1;
			await createPomodoro(interaction, workTime, breakTime, sessionTime);
			await interaction.reply(`Sesión de Pomodoro creada! Se trabajará por **${workTime} minutos**, luego se descansará por **${breakTime} minutos**. Esto se repetirá **${sessionTime} veces**.`);
		}
		else if (interaction.options.getSubcommand() === 'cancelar') {
			const pomodoroSessions = getPomodoroSessionsForGuild(interaction.client, interaction.guild.id);
			const userPomodoro = pomodoroSessions.find(pomodoro => pomodoro.user === interaction.user.id);
			if (!userPomodoro) {
				await interaction.reply('No tienes una sesión de Pomodoro en curso en este servidor.');
				return;
			}
			// TODO: send confirmation buttons
			const confirmation = true;
			if (confirmation) {
				userPomodoro.cancel();
				await interaction.reply('Sesión de Pomodoro cancelada.');
			}
		}
		else if (interaction.options.getSubcommand() === 'sesiones') {
			const pomodoroSessions = getPomodoroSessionsForGuild(interaction.client, interaction.guild.id);
			const embed = pomodoroSessionsEmbed(pomodoroSessions);
			await interaction.reply({ embeds: [embed] });
		}
	},
};