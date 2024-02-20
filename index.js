const fs = require('fs');
const http = require('http');
const { Client, LocalAuth } = require('whatsapp-web.js');
const config = require("./config.json");

const whatsapp = new Client({
  authStrategy: new LocalAuth()
});

whatsapp.on('qr', qr => {
  console.log('QR code received, scan it with your phone.');
});

whatsapp.on('ready', () => {
  console.log('WhatsApp bot is ready!');
});

whatsapp.on('message', async message => {
  try {
    const prefix = config.prefix || '!'; // Default prefix is '!'
    if (!message.body.startsWith(prefix)) return; // Ignore messages without prefix

    const args = message.body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    let commandFilePath = `./commands/${commandName}.js`;
    let command;

    if (fs.existsSync(commandFilePath)) {
      command = require(commandFilePath);
    } else {
      const commandsDir = fs.readdirSync('./commands');
      const commandModule = commandsDir.find(file => {
        const module = require(`./commands/${file}`);
        return module.aliases && module.aliases.includes(commandName);
      });

      if (commandModule) {
        command = require(`./commands/${commandModule}`);
      } else {
        console.log(`Command '${commandName}' not found.`);
        return;
      }
    }

    await command.execute(whatsapp, message, args);
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

whatsapp.initialize();


const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WhatsApp bot is running!');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})