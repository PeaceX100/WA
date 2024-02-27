const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const pokemonN = require('../pokemon.json');

// Function to get a random integer between min (inclusive) and max (exclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Function to get a random Pokémon name based on the specified probabilities
const getRandomPokemonName = () => {

  // Determine the type of Pokémon based on the random number
  if (Math.random() < 0.5) {
    // Normal type Pokémon (50% probability)
    const normalPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'normal')
      .map(([pokemon, type]) => pokemon);
    return normalPokemons[getRandomInt(0, normalPokemons.length)];
  } else if (Math.random() < 0.35) {
    // Rare type Pokémon (35% probability)
    const rarePokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'rare')
      .map(([pokemon, type]) => pokemon);
    return rarePokemons[getRandomInt(0, rarePokemons.length)];
  } else if (Math.random() < 0.05) {
    // Legendary type Pokémon (5% probability)
    const legendaryPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'legendary')
      .map(([pokemon, type]) => pokemon);
    return legendaryPokemons[getRandomInt(0, legendaryPokemons.length)];
  } else if (Math.random() < 0.05) {
    // Mythical type Pokémon (5% probability)
    const mythicalPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'mythical')
      .map(([pokemon, type]) => pokemon);
    return mythicalPokemons[getRandomInt(0, mythicalPokemons.length)];
  } else if (Math.random() < 0.03) {
    // Power type Pokémon (3% probability)
    const powerPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'power')
      .map(([pokemon, type]) => pokemon);
    return powerPokemons[getRandomInt(0, powerPokemons.length)];
  } else {
    // Special type Pokémon (2% probability)
    const specialPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'special')
      .map(([pokemon, type]) => pokemon);
    return specialPokemons[getRandomInt(0, specialPokemons.length)];
  }
};

module.exports = {
  name: 'pokemon',
  aliases: ['wp', 'mon', 'pkm'],
  description: 'Encounter a wild Pokémon!',
  async execute(whatsapp, message) {
    try {
      // Fetch a random Pokémon name based on the specified probabilities
      const pokemonName = getRandomPokemonName();

      // Fetch Pokémon data from the API using the randomly selected name
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = response.data;
      const pokemonNumber = pokemonData.id;

      // Construct image URLs
      const frontDefaultURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonNumber}.png`;
      const frontShinyURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonNumber}.png`;
      const pokemonDisplayName = pokemonData.name;

      // Randomly select between default and shiny image
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
              const catchResult = Math.random() < 0.5 ? `Congratulations! You caught ${pokemonDisplayName}!` : `Oh no! ${pokemonDisplayName} got away!`;
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
