const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
    name: 'help',
    aliases: ['h','menu','m'],
    description: 'Need help? look no further',
    
    execute: async (whatsapp, message, args) => {
      const randomNumber = Math.floor(Math.random() * 2);
      let media;
      if (randomNumber === 0) {
        media = MessageMedia.fromFilePath('././title1.png');
      } else if (randomNumber === 1) {
        media = MessageMedia.fromFilePath('././title2.png');
      }
      const caption = '*☆↦﹝ALAN\'S HELP MENU﹞↤☆*\n\n✹《 _FUN COMMANDS_ 》✹\n*1. 8ball*\n*2. Coinflip*\n*3. RPS(Rock,Paper,Scissors)*\n*4. Binary*\n*4. Say*\n\n✹《 _UPLIFTING COMMANDS_ 》✹\n*1. Motivate*\n*2. Quote*\n*3. Animals*\n*4. Cat*\n*5. Dog*\n\n✹《 _UTILITY COMMANDS_ 》✹\n*1. Calculate*\n*2. Dictionary*\n*3. Help*\n*4. Weather*\n*5. Ping*\n*6. Poll*'
      await whatsapp.sendMessage(message.from, media, { caption });
    }
  };