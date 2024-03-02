const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { getChampionData } = require('../../scraper/lol');
const { getChampionFromAlias } = require('../../constants/league');

const championEmbed = championData => {

	const embed = new EmbedBuilder()
		.setColor(championData.mainColor)
		.setTitle(`${championData.name} - ${championData.role}`)
		.setURL(championData.URL)
		.setThumbnail(championData.champion_thumbnail)
		.setDescription(championData.gameAmount + ' partidas analizadas')
		.addFields(
			{ name: 'Win Rate', value: championData.winRate, inline: true },
			{ name: 'Pick Rate', value: championData.pickRate, inline: true },
			{ name: 'Ban Rate', value: championData.banRate, inline: true },
			{ name: 'Skill Order', value: championData.skillOrder.join(' :arrow_right: ') },
			{ name: 'Starting Build', value: championData.startingBuild.join(' :arrow_right: '), inline: true },
			{ name: '\u200b', value: '\u200b', inline: true },
			{ name: 'Boots', value: championData.boots, inline: true },
			{ name: 'Core Build', value: championData.coreBuild.join(' :arrow_right: ') },
			{ name: 'Runes', value: championData.mainRunes.join('\n'), inline: true },
			{ name: 'Secondary Runes', value: championData.secondaryRunes.join('\n'), inline: true },
			{ name: '\u200b', value: '\u200b', inline: true },
			{ name: 'Counters', value: championData.counters.length !== 0 ? championData.counters.join('\n') : 'No data', inline: true },
			{ name: 'Weak Against', value: championData.weakAgainst.length !== 0 ? championData.weakAgainst.join('\n') : 'No data', inline: true },
		);

	if (championData.junglePaths) {
		Object.keys(championData.junglePaths).forEach(junglePath => {
			if (championData.junglePaths[junglePath].length <= 1) return;
			embed.addFields({ name: junglePath + ' recommended path', value: championData.junglePaths[junglePath].join(' :arrow_right: ') });
		});
	}
	return embed;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('build')
		.setDescription('Busca y obtiene la build de un campeón en u.gg')
		.addStringOption(
			option => option.setName('campeon').setDescription('Nombre del campeon').setRequired(true),
		)
		.addStringOption(
			option => option.setName('posicion').setDescription('Posición del campeon').addChoices(
				{ name: 'Top', value: 'top' },
				{ name: 'Jungla', value: 'jungle' },
				{ name: 'Mid', value: 'middle' },
				{ name: 'Bot', value: 'adc' },
				{ name: 'Support', value: 'support' },
			),
		),
	async execute(interaction) {
		const champion = getChampionFromAlias(interaction.options.getString('campeon'));

		if (!champion) {
			interaction.reply(`No encontré el campeón que me pediste (${interaction.options.getString('campeon')})`);
			return;
		}
		await interaction.deferReply();

		const position = interaction.options.getString('posicion') ?? '';
		const data = await getChampionData(champion, position);
		await interaction.editReply({ embeds: [championEmbed(data)] });
	},
};