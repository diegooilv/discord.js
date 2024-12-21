const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server') // Define o nome do comando como 'server'
		.setDescription('Fornece informações sobre o servidor.'), // Descrição do comando
	async execute(interaction) {
		// interaction.guild é o objeto que representa a Guild (servidor) onde o comando foi executado
		await interaction.reply(`Este servidor é ${interaction.guild.name} e tem ${interaction.guild.memberCount} membros.`);
	},
};
