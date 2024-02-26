module.exports = {
    name: 'uptime',
    aliases: ['up', 'upt'],
    category: 'utility',
    description: 'Shows the uptime of the bot',
  
    execute: async (whatsapp, message, args) => {
      const uptime = whatsapp.info ? whatsapp.info.sessionInfo.client.platform : 0;
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor(uptime / 3600) % 24;
      const minutes = Math.floor(uptime / 60) % 60;
      const seconds = Math.floor(uptime % 60);
  
      const uptimeMessage = `_I have been online for_\n\n *📅${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.📅*`;
  
      await whatsapp.sendMessage(message.from, uptimeMessage);
    },
  };
  