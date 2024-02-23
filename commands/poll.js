const { Poll } = require('whatsapp-web.js');
const { prefix } = require('../config.json')

module.exports = {
    name: 'poll',
    aliases: ['vote','pl','opinion'],
    category: 'utility',
    description: 'Creates a poll with a question and options separated by commas.',
    usage: `${prefix}poll question,option1,option2,...`,

    async execute(whatsapp, message, args) {
        try {
            const input = args.join(' ');
            const [question, ...options] = input.split(',');
            
            if (!question || options.length < 2) {
                await whatsapp.sendMessage(message.from, 'Please provide a question and at least two options separated by commas.');
                return;
            }

            const pollName = question.trim();
            const pollOptions = options.map(option => option.trim());

            const poll = new Poll(pollName, pollOptions);

            // Sending the poll
            await whatsapp.sendMessage(message.from, poll);
        } catch (error) {
            console.error('Error creating poll:', error);
            await whatsapp.sendMessage(message.from, 'An error occurred while creating the poll.');
        }
    }
};
