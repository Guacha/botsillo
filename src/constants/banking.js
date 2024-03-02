const Bank = {
	FALSOLOMBIA: {
		name: 'Falsolombia',
		id: 'falsolombia',
		minimumStartingBalance: 100000,
		safety: 0.95,
		monthlyInterestRate: 0.0025,
	},
	FALSODEBOGOTA: {
		name: 'Falso de Bogota',
		id: 'falsodebogota',
		minimumStartingBalance: 10000,
		safety: 0.9,
		monthlyInterestRate: 0.005,
	},
	FALSOCCIDENTE: {
		name: 'FalsOccidente',
		id: 'falsoccidente',
		minimumStartingBalance: 5000,
		safety: 0.85,
		monthlyInterestRate: 0.01,
	},
	FALSOPOPULAR: {
		name: 'Falso Popular',
		id: 'falsopopular',
		minimumStartingBalance: 1000,
		safety: 0.8,
		monthlyInterestRate: 0.015,
	},
	PICHAFALSA: {
		name: 'Pichincha Falsa',
		id: 'pichafalsa',
		minimumStartingBalance: 100,
		safety: 0.75,
		monthlyInterestRate: 0.02,
	},
};

module.exports = { Bank };