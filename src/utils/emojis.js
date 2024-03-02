const numberToEmoji = (number) => {
	const emojis = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:'];
	if (number <= 10) {
		return emojis[number - 1];
	}
};

module.exports = { numberToEmoji };