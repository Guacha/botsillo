class Pomodoro {
	constructor(workTime, breakTime, cycles = 1, client = null, guild = null, channel = null, user = null) {
		this.workTime = workTime;
		this.breakTime = breakTime;
		this.cycles = cycles;
		this.currentCycle = 0;
		this.client = client;
		this.guild = guild;
		this.channel = channel;
		this.user = user;
		this.currentStatus = '';
		this.currentTimer = null;
	}

	sendMessage(message) {
		this.client.channels.cache.get(this.channel).send(`<@${this.user}> ${message}`);
	}

	start() {
		this.work();
	}

	work() {
		const timer = setTimeout(() => {
			this.sendMessage('Se acabó el tiempo de trabajo. A descansar!');
			this.break();
		}, this.workTime * 1000 * 60);
		this.currentTimer = timer;
		this.currentStatus = 'trabajo';
	}

	break() {
		const timer = setTimeout(() => {
			this.currentCycle++;
			if (this.currentCycle < this.cycles) {
				this.sendMessage('Se acabó el tiempo de descanso. A trabajar!');
				this.work();
			}
			else {
				console.log('All cycles completed. Pomodoro timer done.');
				this.sendMessage('Sesión de Pomodoro completada!');
				this.client.asyncFunctions.get(this.guild).splice(this.client.asyncFunctions.get(this.guild).indexOf(this), 1);
			}
		}, this.breakTime * 1000 * 60);
		this.currentTimer = timer;
		this.currentStatus = 'descanso';
	}

	cancel() {
		clearTimeout(this.currentTimer);
		this.sendMessage('Sesión de Pomodoro cancelada.');
		this.client.asyncFunctions.get(this.guild).splice(this.client.asyncFunctions.get(this.guild).indexOf(this), 1);
	}
}

module.exports = Pomodoro;
