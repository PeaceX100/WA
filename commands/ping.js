module.exports = {
    name: 'ping',
    aliases: ['p', 'latency'],

    execute: async (whatsapp, message, args) => {
      try {
        const startTime = Date.now();
        const sentMessage = await whatsapp.sendMessage(message.from, 'Pinging...');
        const endTime = Date.now();
        const ping = endTime - startTime;
  
        await whatsapp.sendMessage(message.from, `🏓Pong! \n🛜Latency: ${ping}ms`);
      } catch (error) {
        console.error('Error handling ping command:', error);
      }
    }
  };
  