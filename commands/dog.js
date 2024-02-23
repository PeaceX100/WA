const { MessageMedia } = require('whatsapp-web.js');
const fetch = require('node-fetch');
const { prefix } = require('../../config.json');

module.exports = {
  name: "dog",
  aliases: ["doggy", "doggo", "puppy","dg"],
  category: "uplift",
  description: "Sends a random dog pic to up your mood!",
  usage: `${prefix}dog`,

  async execute(whatsapp, message, args) {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const img = (await res.json()).message;

      if (!img) {
        await whatsapp.sendMessage(message.from, "Couldn't fetch a dog image at the moment. Please try again later.");
        return;
      }

      const media = MessageMedia.fromUrl(img);

      await whatsapp.sendMessage(message.from, media);
    } catch (error) {
      console.error("An error occurred while fetching the dog image:", error);
      await whatsapp.sendMessage(message.from, "An error occurred while fetching the dog image.");
    }
  }
};
