const { MessageMedia } = require('whatsapp-web.js');
const animals = require('random-animals-api');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'animals',
    aliases: ['a','ani'],
    category: 'uplift',
    description: `If you don't like cats and dogs which who doesn't use this command to get random images of some other animals`,
    usage: `${prefix}animals bunny/duck/fox/lizard/shiba`,
    execute: async (whatsapp, message, args) => {
        // Define the available animal types
        const availableAnimalTypes = ['bunny', 'duck', 'fox', 'lizard', 'shiba'];
        
        // Check if an animal type was specified
        const requestedAnimalType = args[0];

        if (!requestedAnimalType) {
            await whatsapp.sendMessage(message.from, 'Please specify an animal type (e.g., bunny, duck, fox, lizard, shiba).');
            return;
        }

        // Check if the specified animal type is valid
        if (!availableAnimalTypes.includes(requestedAnimalType)) {
            await whatsapp.sendMessage(message.from, 'Invalid animal type. Please choose from: ' + availableAnimalTypes.join(', '));
            return;
        }

        try {
            // Fetch a random image of the specified animal type
            const url = await animals[requestedAnimalType]();

            const media = MessageMedia.fromUrl(url);

            const caption = `Here's a ${requestedAnimalType}!`;

            await whatsapp.sendMessage(message.from, media, { caption });
        } catch (error) {
            console.error(error);
            await whatsapp.sendMessage(message.from, 'An error occurred while fetching the animal image.');
        }
    },
};
