const { Bank } = require('../../constants/banking');
const { SlashCommandBuilder } = require('@discordjs/builders');

const bankOptions = Object.values(Bank).map(bank => {
	return {
		name: bank.name,
		value: bank.id,
	};
});

// SubcommandGroup: cuentas
// const cuentasGroup = new SlashCommandBuilder()
// 	.setName('cuentas')
// 	.setDescription('Comandos de cuentas bancarias')
// 	.addSubcommand(subcommand =>
// 		subcommand
// 			.setName('abrir')
// 			.setDescription('Abre una cuenta')
// 			.addStringOption(option =>
// 				option
// 					.setName('banco')
// 					.setDescription('El nombre del banco')
// 					.setRequired(true),
// 			)
// 			.addNumberOption(option =>
// 				option
// 					.setName('cantidad')
// 					.setDescription('La cantidad de dinero a depositar')
// 					.setRequired(true),
// 			),
// 	)
// 	.addSubcommand(subcommand =>
// 		subcommand
// 			.setName('cerrar')
// 			.setDescription('Cierra una cuenta')
// 			.addStringOption(option =>
// 				option
// 					.setName('banco')
// 					.setDescription('El nombre del banco')
// 					.setRequired(true),
// 			)
// 	)
// 	.addSubcommand(subcommand =>
// 		subcommand
// 			.setName('saldo')
// 			.setDescription('Muestra el saldo de una cuenta')
// 			.addStringOption(option =>
// 				option
// 					.setName('banco')
// 					.setDescription('El nombre del banco')
// 					.setRequired(true),
// 			),
// 	);

// // SubcommandGroup: movimientos
// const movimientosGroup = new SlashCommandBuilder()
// 	.setName('movimientos')
// 	.setDescription('Comandos de movimientos')
// 	.addSubcommand(subcommand =>
// 		subcommand
// 			.setName('depositar')
// 			.setDescription('Deposita dinero en una cuenta')
// 			.addStringOption(option =>
// 				option
// 					.setName('banco')
// 					.setDescription('El nombre del banco')
// 					.setRequired(true),
// 			)
// 			.addNumberOption(option =>
// 				option
// 					.setName('cantidad')
// 					.setDescription('La cantidad de dinero a depositar')
// 					.setRequired(true),
// 			),
// 	)
// 	.addSubcommand(subcommand =>
// 		subcommand
// 			.setName('retirar')
// 			.setDescription('Retira dinero de una cuenta')
// 			.addStringOption(option =>
// 				option
// 					.setName('banco')
// 					.setDescription('El nombre del banco')
// 					.setRequired(true),
// 			)
// 			.addNumberOption(option =>
// 				option
// 					.setName('cantidad')
// 					.setDescription('La cantidad de dinero a retirar')
// 					.setRequired(true),
// 			),
// 	);

// Agregar los subcommandgroups al comando principal
module.exports = {
	data: new SlashCommandBuilder()
		.setName('banca')
		.setDescription('Comandos de banca y cuentas bancarias')
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup
				.setName('cuentas')
				.setDescription('Comandos de cuentas bancarias')
				.addSubcommand(subcommand =>
					subcommand
						.setName('abrir')
						.setDescription('Abre una cuenta')
						.addStringOption(option =>
							option
								.setName('banco')
								.setDescription('El nombre del banco')
								.setRequired(true)
								.addChoices(...bankOptions),
						)
						.addNumberOption(option =>
							option
								.setName('cantidad')
								.setDescription('La cantidad de dinero a depositar')
								.setRequired(true),
						),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cerrar')
				.setDescription('Cierra una cuenta')
				.addStringOption(option =>
					option
						.setName('banco')
						.setDescription('El nombre del banco')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('saldo')
				.setDescription('Muestra el saldo de una cuenta')
				.addStringOption(option =>
					option
						.setName('banco')
						.setDescription('El nombre del banco')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const subcommandGroup = interaction.options.getSubcommandGroup();

		if (subcommandGroup === 'cuentas') {
			if (subcommand === 'abrir') {
				const bank = interaction.options.getString('banco');
				const amount = interaction.options.getNumber('cantidad');
				// Handle opening a bank account using Firebase
				// Your code here

				await interaction.reply(`Abriendo una cuenta en ${bank} con ${amount} FC`);
			}
			else if (subcommand === 'cerrar') {
				const bank = interaction.options.getString('banco');
				// Handle closing a bank account using Firebase
				// Your code here
				await interaction.reply(`Cerrando una cuenta en ${bank}`);
			}
			else if (subcommand === 'saldo') {
				const bank = interaction.options.getString('banco');
				// Handle checking bank balance using Firebase
				// Your code here
				await interaction.reply(`Chequeando el saldo de ${bank}`);
			}
			else {
				await interaction.reply('Invalid subcommand.');
			}
		}
		else if (subcommandGroup === 'movimientos') {
			if (subcommand === 'depositar') {
				const bank = interaction.options.getString('banco');
				const amount = interaction.options.getNumber('cantidad');
				// Handle depositing money from wallet to bank account using Firebase
				// Your code here
				await interaction.reply(`Depositando ${amount} FC en ${bank}`);
			}
			else if (subcommand === 'retirar') {
				const bank = interaction.options.getString('banco');
				const amount = interaction.options.getNumber('cantidad');
				// Handle withdrawing money from bank account to wallet using Firebase
				// Your code here
				await interaction.reply(`Retirando ${amount} FC de ${bank}`);
			}
			else {
				await interaction.reply('Invalid subcommand.');
			}
		}
		else {
			await interaction.reply('Invalid subcommand group.');
		}
	},
};