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
  const randomNumber = getRandomInt(1, 101); // Generate a random number between 1 and 100

  // Determine the type of Pokémon based on the random number
  if (randomNumber <= 50) {
    // Normal type Pokémon (50% probability)
    const normalPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'normal')
      .map(([pokemon, type]) => pokemon);
    return normalPokemons[getRandomInt(0, normalPokemons.length)];
  } else if (randomNumber <= 85) {
    // Rare type Pokémon (35% probability)
    const rarePokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'rare')
      .map(([pokemon, type]) => pokemon);
    return rarePokemons[getRandomInt(0, rarePokemons.length)];
  } else if (randomNumber <= 90) {
    // Legendary type Pokémon (5% probability)
    const legendaryPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'legendary')
      .map(([pokemon, type]) => pokemon);
    return legendaryPokemons[getRandomInt(0, legendaryPokemons.length)];
  } else if (randomNumber <= 95) {
    // Mythical type Pokémon (5% probability)
    const mythicalPokemons = Object.entries(pokemonN)
      .filter(([pokemon, type]) => type === 'mythical')
      .map(([pokemon, type]) => pokemon);
    return mythicalPokemons[getRandomInt(0, mythicalPokemons.length)];
  } else if (randomNumber <= 98) {
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
      const userId = message.sender.id;

      // Fetch Pokémon data from the API using the randomly selected name
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = response.data;
      const pokemonNumber = pokemonData.id;

      // Construct image URLs
      const frontDefaultURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonNumber}.png`;
      const frontShinyURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonNumber}.png`;
      const pokemonDisplayName = pokemonData.name;

      // Randomly select between default and shiny image
      const isShiny = Math.random() < 0.01; // 1% chance of being shiny
      const imgURL = isShiny ? frontShinyURL : frontDefaultURL;

      // Download the image
      const imgResponse = await axios.get(imgURL, { responseType: 'arraybuffer' });
      const imgBuffer = Buffer.from(imgResponse.data, 'binary');

      // Save the image as a temporary file in tempImg folder
      const tempImgFolder = path.join(__dirname, '..', 'tempImg');
      if (!fs.existsSync(tempImgFolder)) {
        fs.mkdirSync(tempImgFolder);
      }
      const tempImgPath = path.join(tempImgFolder, 'temp.png');
      fs.writeFileSync(tempImgPath, imgBuffer);

      // Send the image with caption
      const media = MessageMedia.fromFilePath(tempImgPath);
      await whatsapp.sendMessage(message.from, media, { caption: `A wild ${pokemonDisplayName} appeared. Catch it!` });

      // Set a timeout to stop waiting for user response after 10 seconds
      const timeoutMs = 15000; // 15 seconds
      const startTime = Date.now();

      // Listen for all incoming messages
      setTimeout(async () => {
        if (whatsapp.listenerCount('message') > 0) {
          // Stop listening for messages
          whatsapp.removeListener('message', listener);
      
          // Check if the Pokémon has been caught
          if (!caughtPokemon) {
            // If not caught, send the timeout message
            await whatsapp.sendMessage(message.from, `You took too long to catch it!\n${pokemonDisplayName} fled!`);
          }
        }
      }, timeoutMs);
      
      // Variable to track whether the Pokémon has been caught
      let caughtOrFled = false;
      let caughtPokemon = false;
      
      // Listen for all incoming messages
      const listener = async (msg) => {
        try {
          if (msg.from === message.from && Date.now() - startTime < timeoutMs) {
            const ballOptions = ['pokeball', 'greatball', 'ultraball', 'masterball'];
            if (ballOptions.includes(msg.body.toLowerCase())) {
              // Respond based on the user's choice of Poké Ball
              const chosenBall = msg.body.toLowerCase();
              const catchProbability = calculateCatchProbability(chosenBall, pokemonName);
              const catchResult = Math.random() < catchProbability ? `Congratulations! You caught ${pokemonDisplayName}!` : `Oh no! ${pokemonDisplayName} got away!`;
              const resultMessage = `You threw a ${chosenBall}!\n${catchResult}`;
              await whatsapp.sendMessage(message.from, resultMessage);
      
              // Set the caughtOrFled flag to true if the Pokémon is caught
              if (catchResult.startsWith('Congratulations' || 'Oh no!')) {
                caughtOrFled = true;
              }

              if (catchResult.startsWith('Congratulations')) {
                userDb.set('caughtPokemons', caughtPokemons.set(pokemonName, isShiny ? `✨${pokemonName}` : pokemonName)).write();
                caughtPokemon = true;
              }
      
              // Stop listening for messages after responding
              whatsapp.removeListener('message', listener);
            }
          }
        } catch (error) {
          console.error('Error handling incoming message:', error);
        }
      };
      
      whatsapp.on('message', listener);

      // Delete the temporary image file
      fs.unlinkSync(tempImgPath);

    } catch (error) {
      console.error('Error encountered while executing pokemon command:', error);
      await whatsapp.sendMessage(message.from, 'An error occurred. Please try again later.');
    }
  },
};

// Function to determine catch probability based on ball type and Pokémon value
const calculateCatchProbability = (ballType, pokemonValue) => {
  switch (ballType) {
    case 'pokeball':
      switch (pokemonValue) {
        case 'normal':
          return 0.5;
        case 'rare':
          return 0.25;
        case 'legendary':
          return 0.05;
        case 'mythical':
          return 0.05;
        case 'power':
          return 0.025;
        case 'special':
          return 0.02;
        default:
          return 0;
      }
    case 'greatball':
      switch (pokemonValue) {
        case 'normal':
          return 0.75;
        case 'rare':
          return 0.5;
        case 'legendary':
          return 0.07;
        case 'mythical':
          return 0.07;
        case 'power':
          return 0.035;
        case 'special':
          return 0.03;
        default:
          return 0;
      }
    case 'ultraball':
      switch (pokemonValue) {
        case 'normal':
          return 1;
        case 'rare':
          return 0.8;
        case 'legendary':
          return 0.1;
        case 'mythical':
          return 0.1;
        case 'power':
          return 0.07;
        case 'special':
          return 0.05;
        default:
          return 0;
      }
    case 'masterball':
      return 1; // Always 100% catch probability for master ball
    default:
      return 0;
  }
};
