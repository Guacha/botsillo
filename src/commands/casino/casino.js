const { ComponentType } = require('discord.js');
const { BlackjackGame } = require('../../utils/casino.js');
const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

const getGameStateEmbed = (game) => {
	const playerHand = game.getPlayerHandEmojis();
	const dealerHand = game.getDealerHandEmojis();
	const embed = new EmbedBuilder()
		.setTitle('Blackjack')
		.setDescription(`Juego en progreso - ${game.user.username}`)
		.addFields(
			{ name: `Tu mano (${game.getPlayerHandValue()})`, value: playerHand },
			{ name: `Mano del dealer (${game.dealerTurn ? game.getDealerHandValue() : '??'})`, value: dealerHand });
	return embed;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('casino')
		.setDescription('Juega al casino')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ruleta')
				.setDescription('Juega a la ruleta')
				.addNumberOption(option =>
					option
						.setName('apuesta')
						.setDescription('La cantidad de dinero a apostar')
						.setRequired(true)
						.setMinValue(1),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('blackjack')
				.setDescription('Juega al blackjack')
				.addNumberOption(option =>
					option
						.setName('apuesta')
						.setDescription('La cantidad de dinero a apostar')
						.setRequired(true)
						.setMinValue(1),
				),
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'ruleta') {
			// Handle roulette game
			// Your code here
		}
		else if (subcommand === 'blackjack') {
			const bet = interaction.options.getNumber('apuesta');
			const wallet = await interaction.client.firebase.getWallet(interaction.user.id);
			if (wallet.balance < bet) {
				await interaction.reply('No tienes suficiente dinero en tu billetera.');
				return;
			}
			const game = new BlackjackGame(interaction.user);
			const embed = getGameStateEmbed(game);
			const actionButtons = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('hit')
						.setLabel('Pedir')
						.setStyle('Success'),
					new ButtonBuilder()
						.setCustomId('stand')
						.setLabel('Plantarse')
						.setStyle('Danger'),

				);
			const response = await interaction.reply({ embeds: [embed], components: [actionButtons] });
			const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
			collector.on('collect', async buttonInteraction => {
				if (buttonInteraction.user.id !== interaction.user.id) {
					await buttonInteraction.reply({ content: 'No puedes interactuar con este juego.', ephemeral: true });
					return;
				}
				if (buttonInteraction.customId === 'hit') {
					game.dealCardToPlayer();
					const newEmbed = getGameStateEmbed(game);
					console.log(game);
					if (game.getPlayerHandValue() > 21) {
						newEmbed.setDescription(`Te pasaste de 21! (-${bet} FC)`);
						await buttonInteraction.update({ embeds: [newEmbed], components: [] });
						collector.stop();
						return;
					}
					await buttonInteraction.update({ embeds: [newEmbed] });
				}
				else if (buttonInteraction.customId === 'stand') {
					game.dealerTurn = true;
					let newEmbed = getGameStateEmbed(game);
					newEmbed.setDescription('Dealer jugando...');
					await buttonInteraction.update({ embeds: [newEmbed], components: [] });
					while (game.getDealerHandValue() < 18 && game.getDealerHandValue() < game.getPlayerHandValue()) {
						game.dealCardToDealer();
						newEmbed = getGameStateEmbed(game);
						newEmbed.setDescription('Dealer jugando...');
						await buttonInteraction.editReply({ embeds: [newEmbed], components: [] });
						await new Promise(resolve => setTimeout(resolve, 1000));
					}
					if (game.getDealerHandValue() > 21 || game.getDealerHandValue() < game.getPlayerHandValue()) {
						const winningMultiplier = game.getPlayerHandValue() === 21 && game.playerHand.length === 2 ? 2.5 : 2;
						await newEmbed.setDescription(`Ganaste! (+${Math.ceil(bet * winningMultiplier)} FC)`);
					}
					else if (game.getDealerHandValue() === game.getPlayerHandValue()) {
						await newEmbed.setDescription(`Empate. (-${bet} FC)`);
					}
					else {
						await newEmbed.setDescription(`Perdiste. (-${bet} FC)`);
					}
					await buttonInteraction.editReply({ embeds: [newEmbed], components: [] });
					collector.stop();
				}
			});


		}
		else {
			await interaction.reply('Invalid subcommand.');
		}
	},
};