const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
    name: 'help',
    aliases: ['h','menu','m'],
    description: 'Need help? look no further',
    
    execute: async (whatsapp, message, args) => {
      const media = MessageMedia.fromFilePath('././');
      await whatsapp.sendMessage(message.from, `*☆↦﹝ALAN'S HELP MENU﹞↤☆*\n\n✹《 _FUN COMMANDS_ 》✹\n*1. 8ball*\n*2. Coinflip*\n*3. RPS(Rock,Paper,Scissors)*,\n*4. Say*\n\n✹《 _UPLIFTING COMMANDS_ 》✹\n*1. Motivate*\n*2. Quote*\n\n✹《 _UTILITY COMMANDS_ 》✹\n*1. Calculate*\n*2. Dictionary*\n*3. Help*\n*4. Ping*`);
    }
  };