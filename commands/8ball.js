module.exports = {
    name: '8ball',
    aliases: ['magicball'],
    description: 'Ask the magic 8-ball a question!',
    execute: async (whatsapp, message, args) => {
      try {
        const question = args.join(' ');
  
        if (!question) {
          await whatsapp.sendMessage(message.from, 'You did not specify your question!');
          return;
        }
  
        const responses = [
          'It is certain.',
          'It is decidedly so.',
          'Without a doubt.',
          'Yes - definitely.',
          'You may rely on it.',
          'As I see it, yes.',
          'Most likely.',
          'Outlook good.',
          'Yes.',
          'Signs point to yes.',
          'Reply hazy, try again.',
          'Ask again later.',
          'Better not tell you now.',
          'Cannot predict now.',
          'Concentrate and ask again.',
          "Don't count on it.",
          'My reply is no.',
          'My sources say no.',
          'Outlook not so good.',
          'Very doubtful.'
        ];
  
        const response = `🎱${responses[Math.floor(Math.random() * responses.length)]}🎱`;
  
        const reply = `*🎱 Let me think 🎱*\n\n*Your Question:* ${question}\n*My Reply:* ${response}`;
  
        await whatsapp.sendMessage(message.from, reply);
      } catch (error) {
        console.error('Error handling 8ball command:', error);
      }
    }
  };
  