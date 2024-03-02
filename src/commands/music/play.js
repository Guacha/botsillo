const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { numberToEmoji } = require('../../utils/emojis');

const buildQueueEmbed = (queue, page = 1) => {

	if (!queue) return new EmbedBuilder().setTitle('No estoy reproduciendo música en este servidor');

	const tracks = queue.tracks.toArray();

	if (tracks.length === 0) {
		return new EmbedBuilder()
			.setTitle('Cola de reproducción')
			.addFields({ name: 'Reproduciendo ahora', value: `${queue.currentTrack.title} - ${queue.currentTrack.author}` }, {
				name: 'No hay canciones en la cola',
				value: 'Agrega canciones con el comando **/music play <tu_cancion_o_link_aqui>**',
			});
	}

	const tracksInPage = tracks.slice((page - 1) * 10, page * 10);
	const embed = new EmbedBuilder()
		.setTitle('Cola de reproducción')
		.setDescription(`Página ${page} de ${Math.ceil(queue.tracks.size / 10)}`)
		.addFields({ name: 'Reproduciendo ahora', value: `${queue.currentTrack.title} - ${queue.currentTrack.author}` });
	tracksInPage.forEach((track, i) => {
		console.log(track);
		embed.addFields({ name: `${numberToEmoji(i + 1)} ${track.title} (Duración: ${track.duration})`, value: `Agregado por: ${track.requestedBy}` });
	});
	return embed;

};


module.exports = {
	data: new SlashCommandBuilder().setName('music').setDescription('Reproduce música!')
		.addSubcommand(subcommand => subcommand
			.setName('play')
			.setDescription('Reproduce una canción')
			.addStringOption(option => option.setName('cancion').setDescription('URL o nombre de la canción a reproducir').setRequired(true)),
		)
		.addSubcommand(subcommand => subcommand
			.setName('stop')
			.setDescription('Detiene la reproducción de música'),
		)
		.addSubcommand(subcommand => subcommand
			.setName('skip')
			.setDescription('Salta la canción actual'),
		)
		.addSubcommand(subcommand => subcommand
			.setName('queue')
			.setDescription('Muestra la cola de reproducción'),
		)
		.addSubcommand(subcommand => subcommand
			.setName('pause')
			.setDescription('Pausa la reproducción de música'),
		)
		.addSubcommand(subcommand => subcommand
			.setName('resume')
			.setDescription('Reanuda la reproducción de música'),
		),
	async execute(interaction) {
		if (!interaction.member.voice.channel) {
			await interaction.reply('¡Debes estar en un canal de voz para usar este comando!');
			return;
		}

		if (interaction.options.getSubcommand() === 'play') {
			await interaction.deferReply();
			const queue = interaction.client.player.nodes.create(interaction.guild);

			const song = interaction.options.getString('cancion');
			let result;
			if (!song.includes('https://')) {
				result = await interaction.client.player.search(song, {
					requestedBy: interaction.user,
					searchEngine: QueryType.AUTO,
				});
			}
			else {
				let searchEngine;
				if (song.includes('youtube.com')) searchEngine = QueryType.YOUTUBE_VIDEO;
				if (song.includes('spotify.com')) searchEngine = QueryType.SPOTIFY;
				if (song.includes('soundcloud.com')) searchEngine = QueryType.SOUNDCLOUD;
				if (song.includes('bandcamp.com')) searchEngine = QueryType.BANDCAMP;
				result = await interaction.client.player.search(song, {
					requestedBy: interaction.user,
					searchEngine,
				});
			}

			if (!result.tracks.length) {
				await interaction.editReply('No encontré la canción que me pediste');
				return;
			}

			await queue.addTrack(result.tracks[0]);
			let embed;
			if (!queue.currentTrack) {
				embed = new EmbedBuilder().addFields(
					{ name: 'Reproduciendo ahora', value: `${result.tracks[0].title} - ${result.tracks[0].author}` },
				);

			}
			else {
				embed = new EmbedBuilder()
					.setTitle('Canción agregada a la cola')
					.setDescription(`Solicitado por ${interaction.user.username}`)
					.addFields(
						{ name: `${result.tracks[0].title} - ${result.tracks[0].author}`, value: '\u200B' },
					);
			}
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);

			await interaction.editReply({ embeds: [embed] });
			if (!queue.node.isPlaying()) await queue.node.play();
		}
		else if (interaction.options.getSubcommand() === 'stop') {
			const queue = interaction.client.player.nodes.get(interaction.guild);
			if (!queue) {
				await interaction.reply('No estoy reproduciendo música en este servidor');
				return;
			}
			queue.connection.destroy();
			await interaction.reply('Detuve la reproducción de música');
		}
		else if (interaction.options.getSubcommand() === 'queue') {
			const embed = buildQueueEmbed(interaction.client.player.nodes.get(interaction.guild));
			await interaction.reply({ embeds: [embed] });
		}
		else if (interaction.options.getSubcommand() === 'skip') {
			const queue = interaction.client.player.nodes.get(interaction.guild);
			if (!queue) {
				await interaction.reply('No estoy reproduciendo música en este servidor');
				return;
			}
			queue.node.skip();
			await interaction.reply('Canción saltada');
		}

	},
};