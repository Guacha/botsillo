const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dinero')
		.setDescription('Maneja tus FalsoCoins')
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup
				.setName('revisar')
				.setDescription('Chequea tu saldo en el banco o en la billetera')
				.addSubcommand(subcommand =>
					subcommand
						.setName('banco')
						.setDescription('Chequea tu saldo en el banco'),
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('billetera')
						.setDescription('Chequea tu saldo en tu billetera'),
				),
		),
	async execute(interaction) {
		const subcommandGroup = interaction.options.getSubcommandGroup();
		const subcommand = interaction.options.getSubcommand();

		if (subcommandGroup === 'revisar') {
			if (subcommand === 'banco') {
				// Handle checking bank balance using Firebase
				// Your code here
			}
			else if (subcommand === 'billetera') {
				const wallet = await interaction.client.firebase.getWallet(interaction.user.id);
				if (!wallet) {
					await interaction.reply('No tienes una billetera! Recién te cree una. Ya puedes usar todos los comandos que requieran FalsoCoins.');
					return;
				}
				await interaction.reply(`Tu saldo en la billetera es: ${wallet.balance} FC`);
			}
			else {
				await interaction.reply('Invalid check subcommand.');
			}
		}
		else if (subcommandGroup === 'mover') {
			if (subcommand === 'deposit') {
				// Handle depositing money from wallet to bank account using Firebase
				// Your code here
			}
			else if (subcommand === 'withdraw') {
				// Handle withdrawing money from bank account to wallet using Firebase
				// Your code here
			}
			else {
				await interaction.reply('Invalid move subcommand.');
			}
		}
		else {
			await interaction.reply('Invalid subcommand group.');
		}
	},
};