const Suit = {
	SPADES: 'spades',
	HEARTS: 'hearts',
	DIAMONDS: 'diamonds',
	CLUBS: 'clubs',
};

const Value = {
	ACE: 'ace',
	TWO: '2',
	THREE: '3',
	FOUR: '4',
	FIVE: '5',
	SIX: '6',
	SEVEN: '7',
	EIGHT: '8',
	NINE: '9',
	TEN: '10',
	JACK: 'jack',
	QUEEN: 'queen',
	KING: 'king',
};

class Card {
	constructor(value, suit) {
		this.value = value;
		this.suit = suit;
	}

	getEmojis() {
		const suits = {
			spades: '<:bottom_spade:738101180877766736>',
			hearts: '<:bottom_heart:738101180865052771>',
			diamonds: '<:bottom_diamond:738101180416393317>',
			clubs: '<:bottom_club:738101180626108476>',
		};

		const values = {
			'ace': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:ra:738101181246734496>' : '<:ba:738101180307210372>',
			'2': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r2:738101181011722291>' : '<:b2:738101179753431203>',
			'3': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r3:738101180886155277>' : '<:b3:738101180126855229>',
			'4': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r4:738101180944875641>' : '<:b4:738101180185706586>',
			'5': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r5:738101181062185161>' : '<:b5:738101180168798299>',
			'6': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r6:738101181087219773>' : '<:b6:738101180349153370>',
			'7': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r7:738101180936224991>' : '<:b7:738101180328050749>',
			'8': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r8:738101181204791376>' : '<:b8:738101180479176785>',
			'9': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r9:738101181208985670>' : '<:b9:738101180638560467>',
			'10': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:r10:738101181204660244>' : '<:b10:738101180500148244>',
			'jack': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:rj:738101181015916555>' : '<:bj:738101180537897083>',
			'queen': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:rq:738101181087350968>' : '<:bq:738101180890087467>',
			'king': this.suit === Suit.DIAMONDS || this.suit === Suit.HEARTS ? '<:rk:738101181196271666>' : '<:bk:738101180579840130>',
		};

		const suitEmoji = suits[this.suit];
		const valueEmoji = values[this.value];
		return [valueEmoji, suitEmoji];
	}
	getCardBack() {
		return ['<:cardback_top:738101181372694619>', '<:cardback_bottom:738101180911059024>'];
	}

}

class Deck {
	constructor() {
		this.cards = [];
	}

	addCard(card) {
		this.cards.push(card);
	}

	createStandardDeck() {
		const suits = Object.values(Suit);
		const values = Object.values(Value);

		for (const suit of suits) {
			for (const value of values) {
				const card = new Card(value, suit);
				this.addCard(card);
			}
		}
	}

	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	dealCard() {
		if (this.cards.length === 0) {
			throw new Error('No cards left in the deck');
		}
		return this.cards.shift();
	}
}

class BlackjackGame {
	constructor(user) {
		this.deck = new Deck();
		this.deck.createStandardDeck();
		this.deck.shuffle();
		this.playerHand = [];
		this.dealerHand = [];
		this.user = user;
		this.dealerTurn = false;
		this.dealCardToPlayer();
		this.dealCardToDealer();
		this.dealCardToPlayer();
		this.dealCardToDealer();
	}

	dealCardToPlayer() {
		const card = this.deck.dealCard();
		this.playerHand.push(card);
	}

	dealCardToDealer() {
		const card = this.deck.dealCard();
		this.dealerHand.push(card);
	}

	getPlayerHandEmojis() {
		return this.playerHand.map(card => card.getEmojis()[0]).join(' ') + '\n' + this.playerHand.map(card => card.getEmojis()[1]).join(' ');
	}

	getDealerHandEmojis() {
		if (this.dealerTurn) {
			return this.dealerHand.map(card => card.getEmojis()[0]).join(' ') + '\n' + this.dealerHand.map(card => card.getEmojis()[1]).join(' ');
		}
		else {
			return this.dealerHand[0].getCardBack()[0]
				+ this.dealerHand[1].getEmojis()[0]
				+ '\n'
				+ this.dealerHand[0].getCardBack()[1]
				+ this.dealerHand[1].getEmojis()[1];
		}
	}

	getPlayerHandValue() {
		return this.getHandValue(this.playerHand);
	}

	getDealerHandValue() {
		return this.getHandValue(this.dealerHand);
	}

	getHandValue(hand) {
		let value = 0;
		let aceCount = 0;

		for (const card of hand) {
			if (card.value === Value.ACE) {
				aceCount++;
				value += 11;
			}
			else if (card.value === Value.JACK || card.value === Value.QUEEN || card.value === Value.KING) {
				value += 10;
			}
			else {
				value += parseInt(card.value);
			}
		}

		while (value > 21 && aceCount > 0) {
			value -= 10;
			aceCount--;
		}

		return value;
	}

}

module.exports = { Deck, Card, Suit, Value, BlackjackGame };
