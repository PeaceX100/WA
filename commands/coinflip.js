module.exports = {
    name: 'coinflip',
    aliases: ['cf','flip','ht'],
    category: 'fun',
    description: 'Flips a coin.',
    execute: async (whatsapp, message, args) => {
        const side = Math.random > 0.5 ? 'Heads' : 'Tails';
        const result = side;
        const contact = await message.getContact();
        const senderName = contact.pushname || 'Unknown';
    await whatsapp.sendMessage(message.from, `*🪙Coin Flip🪙*\n\nFlipped *🪙${result}*\n\nFlipped By *${senderName}*`);
      }
}