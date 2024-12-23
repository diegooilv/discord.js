const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
// Carrega as frases do arquivo JSON
const frasesPath = path.join('frases.json');
const frases = JSON.parse(fs.readFileSync(frasesPath, 'utf-8'));

// Função para escolher uma frase aleatória
function escolherFrase() {
    const indice = Math.floor(Math.random() * frases.length);
    return frases[indice];
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('reflexao')
        .setDescription('Receba uma frase de amor próprio aleatória.'),

    async execute(interaction) {
        const frase = escolherFrase(); // Função para escolher a frase aleatória

        // Criação do Embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // Defina a cor do embed
            .setTitle('Reflexão do Dia')
            .setDescription(`${frase.frase}`)
            .setFooter({ text: `— ${frase.autor}` })
            .setTimestamp(); // Marca o horário de quando a frase foi enviada

        // Envia o embed como resposta
        await interaction.reply({ embeds: [embed] });
    },
};