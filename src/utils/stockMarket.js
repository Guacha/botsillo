const StockTags = {
	TECHNOLOGY: 'tech',
	SOFTWARE: 'software',
	HARDWARE: 'hardware',
	ELECTRONICS: 'electronics',
	GAMING: 'gaming',
	FOOD: 'food',
	SCIENCE: 'science',
	HEALTH: 'health',
	MEDICINE: 'medicine',
	PHARMA: 'pharma',
	AUTOMOTIVE: 'automotive',
	TRANSPORT: 'transport',
	AIRLINES: 'airlines',
	ENERGY: 'energy',
	UTILITIES: 'utilities',
	TELECOM: 'telecom',
	MEDIA: 'media',
	ENTERTAINMENT: 'entertainment',
	EDUCATION: 'education',
	FINANCE: 'finance',
	BANKING: 'banking',
	INSURANCE: 'insurance',
	CONSTRUCTION: 'construction',
	INDUSTRIAL: 'industrial',
	MANUFACTURING: 'manufacturing',
	INTERNET: 'internet',
	ECOMMERCE: 'ecommerce',
	RETAIL: 'retail',
	WHOLESALE: 'wholesale',
	SHIPPING: 'shipping',
};

const StockSeeding = {
	'FRAUD': {
		'name': 'FraudTech Solutions',
		'value': 90,
		'stability': 0.7,
		'volatility': 0.4,
		'stocksInCirculation': 12000000,
		'tags': ['technology', 'finance'],
	},
	'SCAM': {
		'name': 'ScamSoft Inc.',
		'value': 80,
		'stability': 0.6,
		'volatility': 0.5,
		'stocksInCirculation': 15000000,
		'tags': ['software', 'finance'],
	},
	'LIES': {
		'name': 'LiesCorp Innovations',
		'value': 95,
		'stability': 0.8,
		'volatility': 0.3,
		'stocksInCirculation': 11000000,
		'tags': ['technology', 'media'],
	},
	'DECOY': {
		'name': 'DecoyTech Dynamics',
		'value': 75,
		'stability': 0.9,
		'volatility': 0.2,
		'stocksInCirculation': 13000000,
		'tags': ['technology', 'gaming'],
	},
	'PHONY': {
		'name': 'PhonyPharma Solutions',
		'value': 85,
		'stability': 0.5,
		'volatility': 0.6,
		'stocksInCirculation': 10000000,
		'tags': ['pharma', 'health'],
	},
	'UNRL': {
		'name': 'UnrealIndustries Inc.',
		'value': 110,
		'stability': 0.4,
		'volatility': 0.7,
		'stocksInCirculation': 8000000,
		'tags': ['industrial', 'technology'],
	},
	'BLUFF': {
		'name': 'BluffBank Corp.',
		'value': 65,
		'stability': 0.6,
		'volatility': 0.5,
		'stocksInCirculation': 14000000,
		'tags': ['banking', 'finance'],
	},
	'DODGY': {
		'name': 'DodgyData Systems',
		'value': 120,
		'stability': 0.3,
		'volatility': 0.8,
		'stocksInCirculation': 9000000,
		'tags': ['technology', 'software'],
	},
	'CNSPIR': {
		'name': 'ConspiracyTech Labs',
		'value': 100,
		'stability': 0.7,
		'volatility': 0.4,
		'stocksInCirculation': 9500000,
		'tags': ['technology', 'media'],
	},
	'ABNDN': {
		'name': 'AbandonNet Solutions',
		'value': 50,
		'stability': 0.9,
		'volatility': 0.8,
		'stocksInCirculation': 16000000,
		'tags': ['technology', 'internet'],
	},
};

class SimulatedStockMarket {

	constructor(firebaseClient) {

		this.stocks = firebaseClient.initialiseStocks(StockSeeding);

	}

	getStocks() {
		return this.stocks;
	}

	startSimulation(firebaseClient) {
		setInterval(async (db) => {
			for (const [stockId, stock] of Object.entries(this.stocks)) {
				// simulate ultra rare stock event.
				// stocks with low stability have a chance to change value drastically
				if (Math.random() < stock.stability / 100 && stock.stability < 0.5) {
					const upOrDown = Math.random() < 0.5 ? -1 : 1;
					const newValue = stock.value * (1 + (Math.random() * 0.5 + 0.5) * upOrDown);
					this.stocks[stockId].value = newValue;
					await db.updateStockValue(stockId, newValue);
					continue;
				}

				// simulate rare stock event
				// stocks with low volatility have a chance to change value slightly
				if (Math.random() < stock.stability / 20 && stock.volatility < 0.7) {
					const newValue = stock.value + (Math.random() * 10 - 5);
					this.stocks[stockId].value = newValue;
					await db.updateStockValue(stockId, newValue);
					continue;
				}

				// simulate common stock event
				if (Math.random() < stock.stability / 10) {
					const newValue = stock.value + (Math.random() * 5 - 2.5);
					this.stocks[stockId].value = newValue;
					await db.updateStockValue(stockId, newValue);
					continue;
				}

				// simulate normal stock value change
				const newValue = stock.value + (Math.random() * stock.volatility - stock.volatility / 2);
				this.stocks[stockId].value = newValue;
				await db.updateStockValue(stockId, newValue);
				console.log('Stock value changed:', stockId, stock.value, '->', newValue);
			}
		}, 500, firebaseClient);
	}


}

module.exports = SimulatedStockMarket;