const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'pokemon',
  aliases: ['wp', 'mon', 'pkm'],
  description: 'Encounter a wild Pokémon!',
  async execute(whatsapp, message) {
    try {
      // Fetch Pokémon data from the API
      const pokemonName = 'ditto';
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = response.data;
      const pokemonNumber = pokemonData.id;

      // Construct GIF URLs
      const frontDefaultURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonNumber}.png`;
      const frontShinyURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonNumber}.png`;
      const pokemonDisplayName = pokemonData.name;

      // Randomly select between default and shiny GIF
      const imgURL = Math.random() < 0.01 ? frontShinyURL : frontDefaultURL;

      // Download the image
      const imgResponse = await axios.get(imgURL, { responseType: 'arraybuffer' });
      const imgBuffer = Buffer.from(imgResponse.data, 'binary');

      // Save the image as a temporary file in tempImg folder
      const tempImgFolder = path.join(__dirname, 'tempImg');
      if (!fs.existsSync(tempImgFolder)) {
        fs.mkdirSync(tempImgFolder);
      }
      const tempImgPath = path.join(tempImgFolder, 'temp.png');
      fs.writeFileSync(tempImgPath, imgBuffer);

      // Send the image with caption
      const media = MessageMedia.fromFilePath(tempImgPath);
      await whatsapp.sendMessage(message.from, media, { caption: `A wild ${pokemonDisplayName} appeared. Catch it!` });

      // Set a timeout to stop waiting for user response after 15 seconds
      const timeoutMs = 15000; // 15 seconds
      const startTime = Date.now();

      // Listen for all incoming messages
      whatsapp.on('message', async (msg) => {
        try {
          if (msg.from === message.from && Date.now() - startTime < timeoutMs) {
            const ballOptions = ['pokeball', 'greatball', 'ultraball', 'masterball'];
            if (ballOptions.includes(msg.body.toLowerCase())) {
              // Respond based on the user's choice of Poké Ball
              const chosenBall = msg.body.toLowerCase();
              const catchResult = Math.random() < 0.5 ? 'Congratulations! You caught it!' : 'Oh no! It got away!';
              const resultMessage = `You threw a ${chosenBall}!\n${catchResult}`;
              await whatsapp.sendMessage(message.from, resultMessage);
            }
          }
        } catch (error) {
          console.error('Error handling incoming message:', error);
        }
      });

      // Delete the temporary image file
      fs.unlinkSync(tempImgPath);

    } catch (error) {
      console.error('Error encountered while executing pokemon command:', error);
      await whatsapp.sendMessage(message.from, 'An error occurred. Please try again later.');
    }
  },
};
