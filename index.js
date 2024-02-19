const fs = require('fs');
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

    // Check if the command file exists
    const commandFilePath = `./commands/${commandName}.js`;
    if (fs.existsSync(commandFilePath)) {
      const command = require(commandFilePath);
      await command.execute(whatsapp, message, args);
    } else {
      console.log(`Command '${commandName}' not found.`);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

whatsapp.initialize();
