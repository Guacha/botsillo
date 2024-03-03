const { Bank } = require('../constants/banking');

const { initializeApp } = require('firebase-admin/app');
const {
	getFirestore,
} = require('firebase-admin/firestore');

class FirebaseClient {

	constructor() {
		this.app = initializeApp({
			projectId: process.env.FIREBASE_PROJECT_ID,
		});

		this.db = getFirestore();
	}

	async initialiseBanks() {
		const banks = Object.values(Bank);
		console.log('Initialising banks:', banks);
		for (const bank of banks) {
			// if bank does not exist, create it
			// if bank exists, do nothing
			const bankDoc = await this.db.collection('banks').doc(bank.id).get();
			if (!bankDoc.exists) {
				console.log('Bank does not exist, creating:', bank);
				await this.db.collection('banks').doc(bank.id).set({
					name: bank.name,
					minimumStartingBalance: bank.minimumStartingBalance,
					safety: bank.safety,
					monthlyInterestRate: bank.monthlyInterestRate,
				});
			}
		}
	}

	async getBankAccount(userId, bank) {
		const bankAccountDoc = await this.db.collection('banks').doc(bank).collection('accounts').doc(bank).get();
		if (!bankAccountDoc.exists) {
			console.log('Bank account does not exist, creating:', userId, bank);
			await this.db.collection('banks').doc(bank.id).collection('accounts').doc(userId).set({
				balance: 0,
			});
		}
		return bankAccountDoc;
	}
	async getWallet(userId) {
		const walletDoc = await this.db.collection('wallets').doc(userId).get();
		if (!walletDoc.exists) {
			console.log('Wallet does not exist, creating:', userId);
			await this.db.collection('wallets').doc(userId).set({
				balance: 1,
			});
		}
		return walletDoc.data();
	}
	async initialiseStocks(seeding) {
		// create stocks collection if it does not exist
		const stocksCollection = this.db.collection('stonks');
		const stocks = await stocksCollection.get();
		if (stocks.empty) {
			console.log('Initialising stocks collection');
			for (const [stockId, stock] of Object.entries(seeding)) {
				console.log('Creating stock:', stockId);
				await stocksCollection.doc(stockId).set(stock);
			}
		}
	}

	async getStockData(stockId) {
		const stockDoc = await this.db.collection('stonks').doc(stockId).get();
		if (!stockDoc.exists) {
			throw new Error('Stock does not exist');
		}
		return stockDoc.data();
	}

	async updateStockValue(stockId, newValue) {
		await this.db.collection('stocks').doc(stockId).update({
			value: newValue,
			history: {
				[new Date().toISOString()]: newValue,
			},
		});
	}
}

module.exports = FirebaseClient;
