const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user') // Define o nome do comando
		.setDescription('Fornece informações sobre o usuário.'), // Descrição do comando
	async execute(interaction) {
		// interaction.user é o objeto que representa o Usuário que executou o comando
		// interaction.member é o objeto GuildMember, que representa o usuário na guilda específica
		await interaction.reply(`Este comando foi executado por ${interaction.user.username}, que entrou em ${interaction.member.joinedAt}.`);
	},
};
