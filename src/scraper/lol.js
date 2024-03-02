const cheerio = require('cheerio');
const { getChampionColor } = require('../utils/championColor');

const fetchChampion = async (championName, position = '') => {
	const response = await fetch(`https://leagueofgraphs.com/champions/builds/${championName}/${position}`);
	// get HTML
	const html = await response.text();
	// load HTML into cheerio
	const $ = cheerio.load(html);

	return $;
};

const processProBuildData = (rows) => {
	rows.forEach((row) => {
		const $ = cheerio.load(row);
		const probuild = {};
		probuild.proName = $('div.probuildsProname').text().trim();
		probuild.date = new Date(parseInt($('div.gameDate').attr('data-timestamp-date')));
		probuild.kills = $('span.kills').text().trim();
		probuild.deaths = $('span.deaths').text().trim();
		probuild.assists = $('span.assists').text().trim();
		probuild.vs = $('#probuilds tr:not([class]) td div.margin-centered img').attr('alt');
	});
};

const processJunglePaths = ($) => {
	const junglePaths = {};
	if ($('a[href*="jungle"]').length) {
		$('div.path').each((i, el) => {
			const path = $(el).children('img').map((i, el) => $(el).attr('alt')).toArray();
			const pathName = $(el).prev().text().trim();
			junglePaths[pathName] = path;
		});
	}
	return junglePaths;
};

const getChampionData = async (championName, position = '') => {

	const $ = await fetchChampion(championName, position);

	const championData = {};

	championData.URL = `https://leagueofgraphs.com/champions/builds/${championName}/${position}`;
	championData.champion_thumbnail = 'https:' + $('.pageBanner > .img > img').first().attr('src');
	// get champion name
	championData.name = $('.pageBanner h2').first().text().trim();
	// get champion role
	championData.role = $('.roleEntry .txt').first().text().trim();
	// get champion win rate
	championData.winRate = $('#graphDD2').text().trim();
	// get champion pick rate
	championData.pickRate = $('#graphDD1').first().text().trim();
	// get champion ban rate
	championData.banRate = $('#graphDD3').first().text().trim();

	championData.gameAmount = $('#matchesCountNumber').text().trim();
	// skill order
	championData.skillOrder = [];
	$('.championSpellLetter:lt(3)').each((i, el) => {
		championData.skillOrder.push($(el).text().trim());
	});

	// get champion build
	championData.startingBuild = [];
	$('a[href*="items"] div.iconsRow').first()
		.find('.championSpell').each((i, el) => {
			let item = $(el).find('img').attr('alt');
			if (item.toLowerCase().includes('ward')) return;
			if ($(el).text().trim().toLowerCase().includes('x2')) {
				item += ' x2';
			}
			championData.startingBuild.push(item);

		});

	championData.coreBuild = [];
	$('a[href*="items"] div.iconsRow').eq(1)
		.find('.championSpell').each((i, el) => {
			const item = $(el).find('img').attr('alt');
			if (item.toLowerCase().includes('ward')) return;
			championData.coreBuild.push(item);

		});
	championData.mainRunes = [];
	$('.perksTableOverview').first().find('td div div:not([style*="opacity: 0.2;"]) img').each((i, el) => {
		let rune = $(el).attr('alt');
		if (i === 0) rune = ':small_orange_diamond: **' + rune + '**';
		championData.mainRunes.push(rune);
	});

	championData.secondaryRunes = [];
	$('.perksTableOverview.secondary').first().find('td div div:not([style*="opacity: 0.2;"]) img').each((i, el) => {
		const rune = $(el).attr('alt');
		championData.secondaryRunes.push(rune);
	});

	championData.boots = $('a[href*="items"] div.iconsRow').eq(2)
		.find('.championSpell').find('img').attr('alt');
	championData.mainColor = await getChampionColor(championData.champion_thumbnail);

	championData.proBuilds = processProBuildData($('#probuilds tr:not([class]):not(:has(button.overviewSeeMoreButton))').toArray());

	championData.counters = [];
	$('h3:contains("Counters")').next().find('img').each((i, el) => {
		const counter = $(el).attr('alt');
		championData.counters.push(counter);
	});

	championData.weakAgainst = [];
	$('h3:contains("countered by")').next().find('img').each((i, el) => {
		const weak = $(el).attr('alt');
		championData.weakAgainst.push(weak);
	});

	championData.junglePaths = processJunglePaths($);

	return championData;
};

module.exports = {
	fetchChampion,
	getChampionData,
};