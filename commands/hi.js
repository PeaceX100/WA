module.exports = {
    name: 'hi',
    execute: async (whatsapp, message, args) => {
      await message.reply('Hello!');
    }
  };