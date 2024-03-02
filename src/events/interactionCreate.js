const { Collection, Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		const { cooldowns } = interaction.client;
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 1;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			const maxUses = command.maxUses;

			if (now < expirationTime && (maxUses === undefined || timestamps.get(interaction.user.id).usage >= maxUses)) {
				const timeLeft = (expirationTime - now) / 1_000;
				await interaction.reply({ content: `Por favor espera ${timeLeft.toFixed(1)} segundo(s) más antes de usar el comando \`${command.data.name}\` de nuevo.`, ephemeral: true });
				return;
			}
		}

		try {
			await command.execute(interaction);
			timestamps.set(interaction.user.id, {
				timestamp: now,
				usage: (timestamps.get(interaction.user.id)?.usage ?? 0) + 1,
			});
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};