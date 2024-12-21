// Requer as classes necessárias do discord.js
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { loadBackup, saveBackup, getUserData } = require('./manageBackup');

// Carregar os dados do backup ao iniciar
loadBackup();

// Acessa o token diretamente das variáveis de ambiente carregadas pelo dotenv
const token = process.env.TOKEN;

// Cria uma nova instância do cliente
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// Função recursiva para ler comandos de subpastas
function readCommandsFromDirectory(directory) {
    const filesAndDirs = fs.readdirSync(directory);  // Lê todos arquivos e diretórios dentro da pasta
    for (const fileOrDir of filesAndDirs) {
        const fullPath = path.join(directory, fileOrDir);  // Caminho completo do arquivo ou diretório
        const stats = fs.statSync(fullPath);  // Verifica se é arquivo ou diretório

        if (stats.isDirectory()) {
            // Se for um diretório, chama a função recursivamente para explorar a subpasta
            readCommandsFromDirectory(fullPath);
        } else if (fileOrDir.endsWith('.js')) {
            // Se for um arquivo .js, carrega o comando
            const command = require(fullPath);

            // Verifica se o comando possui as propriedades 'data' e 'execute'
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);  // Armazena o comando na coleção
            } else {
                console.log(`[AVISO] O comando em ${fullPath} está faltando uma propriedade "data" ou "execute".`);
            }
        }
    }
}

// Caminho para a pasta 'commands'
const foldersPath = path.join(__dirname, 'commands');
readCommandsFromDirectory(foldersPath);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
        }
    }
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Pronto! Logado como ${readyClient.user.tag}`);
});

// Evento de mensagem para capturar e salvar automaticamente as variáveis
client.on('messageCreate', message => {
    if (!message.author.bot) {
        const userId = message.author.id;

        // Obter os dados do usuário como um Proxy
        const userData = getUserData(userId);

        // Qualquer modificação em `userData` será automaticamente salva
        userData.lastMessage = message.content; // Salva o conteúdo da última mensagem
        userData.messagesCount = (userData.messagesCount || 0) + 1; // Incrementa o contador de mensagens

        console.log(`Dados do usuário ${message.author.tag}:`, userData);

        // Opcional: Responder ao usuário
        message.reply(`Você já enviou ${userData.messagesCount} mensagens!`);
    }
});

client.login(token);

// Agendar o backup a cada 30 segundos
setInterval(saveBackup, 30000);

console.log('Servidor iniciado e backup automático ativado.');
