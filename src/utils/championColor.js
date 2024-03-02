const colorThief = require('colorthief');
const fs = require('fs');

const getChampionColor = async (imageUrl) => {
	try {
		const filename = imageUrl.split('/').pop();
		if (fs.existsSync(`temp/${filename}.jpg`)) {
			const color = await colorThief.getColor(`temp/${imageUrl}`);
			return color;
		}
		const imgData = await fetch(imageUrl);
		const imgBytes = await imgData.arrayBuffer();
		const imgBuffer = Buffer.from(imgBytes);
		fs.writeFileSync(`temp/${filename}`, imgBuffer);
		const color = await colorThief.getColor(`temp/${filename}`);
		return color;
	}
	catch (error) {
		return [0, 0, 0];
	}

};

module.exports = {
	getChampionColor,
};