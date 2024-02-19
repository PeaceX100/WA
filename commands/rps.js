module.exports = {
  name: 'rps',
  aliases: ['rock', 'paper', 'scissors'],
  description: "Plays rock paper scissors with the bot!",
  usage: "rps (rock/paper/scissors)",
  execute: async (whatsapp, msg, args) => {
    try {
      const rps = ['scissors', 'rock', 'paper'];
      const res = [`✂️ Scissors`, `🗿 Rock`, `🗞️ Paper`];

      let userChoice;
      if (args.length) userChoice = args[0].toLowerCase();
      if (!rps.includes(userChoice))
        return whatsapp.sendMessage(msg.from, 'Please enter rock, paper, or scissors');
      userChoice = rps.indexOf(userChoice);

      const botChoice = Math.floor(Math.random() * 3);
      let result;

      const contact = await msg.getContact();
      const senderName = contact.pushname || 'Unknown';

      if (userChoice === botChoice) result = 'It\'s a draw, no one wins';
      else if ((userChoice === 0 && botChoice === 2) || (userChoice === 1 && botChoice === 0) || (userChoice === 2 && botChoice === 1))
        result = `*${senderName}* Wins!`;
      else result = `*${whatsapp.info.pushname}* Wins!`;

      const reply = `*${senderName}* vs *${whatsapp.info.pushname}* RPS\n\n${senderName}: ${res[userChoice]}\n${whatsapp.info.pushname}: ${res[botChoice]}\nResults: ${result}`;

      await whatsapp.sendMessage(msg.from, reply);
    } catch (error) {
      console.error('Error handling rps command:', error);
    }
  }
};
