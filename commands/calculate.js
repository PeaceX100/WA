const math = require('mathjs');

module.exports = {
  name: 'calculate',
  aliases: ['calc', 'calculator'],
  category: 'utility',
  description: "Shows Calculated Answers Of User's Query",
  usage: 'calc [query](mathematical)',

  async execute(whatsapp, message) {
    const args = message.body.trim().split(' ');

    if (args.length < 2) {
      await whatsapp.sendMessage(message.from, '*Enter something to calculate*');
      return;
    }

    let result;
    try {
      result = math.evaluate(
        args
          .slice(1)
          .join(' ')
          .replace(/[x]/gi, '*')
          .replace(/[,]/g, '.')
          .replace(/[÷]/gi, '/')
      );
      // Ensure the result is a string
      result = result.toString();
    } catch (e) {
      await whatsapp.sendMessage(message.from, '*Enter a valid calculation!*\n\n*List of Calculations* - \n1. *sqrt equation* - `sqrt(3^2 + 4^2) = 5`\n2. *Units to Units* - `2 inch to cm = 0.58`\n3. *Complex Expressions Like* - `cos(45 deg) = 0.7071067811865476`\n4. *Basic Maths Expressions* - `+, -, ^, /, decimals` = *2.5 - 2 = 0.5*');
      return;
    }

    await whatsapp.sendMessage(message.from, `*Operation:*\n${args.slice(1).join(' ')}\n\n*Result:*\n${result}`);
  },
};
