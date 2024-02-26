let startTime; // Variable to store the start time

module.exports = {
  name: 'uptime',
  aliases: ['upt'],
  category: 'utility',
  description: 'Shows the uptime of the bot',

  execute: async (whatsapp, message, args) => {
    // Function to format the uptime in days, hours, minutes, and seconds
    const formatUptime = (seconds) => {
      seconds = Number(seconds);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor(seconds % (3600 * 24) / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = Math.floor(seconds % 60);
      
      let uptimeMessage = `*_🤖I have been online for🤖_*\n\n*📅${d} days, ${h} hours, ${m} minutes, and ${s} seconds.📅*`;

      return uptimeMessage;
    };

    // Get the current time
    const currentTime = Date.now();

    // Calculate the uptime in seconds based on the current time and start time
    const uptimeSeconds = Math.floor((currentTime - startTime) / 1000);

    // Format the uptime and send the message
    const uptimeMessage = formatUptime(uptimeSeconds);
    await whatsapp.sendMessage(message.from, uptimeMessage);
  },

  // Function to set the start time when the bot is ready
  setStartTime: () => {
    startTime = Date.now();
  }
};
