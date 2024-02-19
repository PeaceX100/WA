module.exports = {
    name: 'binary',
    aliases: ['bi', '01'],
    description: 'Converts text into binary code',
    execute: async (whatsapp, message, args) => {
      try {
        if (args.length === 0) {
          await whatsapp.sendMessage(message.from, 'Please provide text to convert into binary.');
          return;
        }
  
        const text = args.join(' ');
        const binaryData = text
          .split('')
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
  
        const reply = `*🤖Binary Code🤖:* \`${binaryData}\``;
  
        await whatsapp.sendMessage(message.from, reply);
      } catch (error) {
        console.error('Error handling binary command:', error);
      }
    }
  };
  