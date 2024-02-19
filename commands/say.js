module.exports = {
    name: 'say',
    aliases: ['echo', 'repeat'],
    description: "Repeats the provided message.",
    execute: async (whatsapp, message, args) => {
      try {
        if (args.length === 0) {
          await whatsapp.sendMessage(message.from, 'Please provide a message to repeat.');
          return;
        }
  
        const text = args.join(' ');
  
        await whatsapp.sendMessage(message.from, text);
      } catch (error) {
        console.error('Error handling say command:', error);
      }
    }
  };
  