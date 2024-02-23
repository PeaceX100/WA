const { MessageMedia } = require('whatsapp-web.js');
const fetch = require('node-fetch');
const { prefix } = require('../../config.json');

module.exports = {
  name: "cat",
  description: "Sends a random cat image/gif to up your mood!",
  category: "uplift",
  aliases: ["kitten", "kitty", "meow"],
  usage: `${prefix}cat`,

  async execute(whatsapp, message, args) {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();

      if (!data || data.length === 0 || !data[0].url) {
        await whatsapp.sendMessage(message.from, "Couldn't fetch a cat image at the moment. Please try again later.");
        return;
      }

      const imageUrl = data[0].url;
      const media = MessageMedia.fromUrl(imageUrl);

      await whatsapp.sendMessage(message.from, media);
    } catch (error) {
      console.error("An error occurred while fetching the cat image:", error);
      await whatsapp.sendMessage(message.from, "An error occurred while fetching the cat image.");
    }
  }
};
