const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');
const { prefix } = require('../config.json');

module.exports = {
  name: "dog",
  aliases: ["doggy", "doggo", "puppy","dg"],
  category: "uplift",
  description: "Sends a random dog pic to up your mood!",
  usage: `${prefix}dog`,

  async execute(whatsapp, message, args) {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      const img = response.data.message;

      if (!img) {
        await whatsapp.sendMessage(message.from, "Couldn't fetch a dog image at the moment. Please try again later.");
        return;
      }

      const fileName = `dog_${Date.now()}.jpeg`; // Unique file name for the image
      const filePath = `tempImg/${fileName}`;

      // Ensure tempImg folder exists
      if (!fs.existsSync('tempImg')) {
        fs.mkdirSync('tempImg');
      }

      // Save the image file
      const imageResponse = await axios.get(img, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, imageResponse.data);

      // Send the image as a message
      const caption = '🐕 Dog 🐕';
      const media = MessageMedia.fromFilePath(filePath);
      await whatsapp.sendMessage(message.from, media, { caption });

      // Delete the temporary image file
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("An error occurred while fetching the dog image:", error);
      await whatsapp.sendMessage(message.from, "An error occurred while fetching the dog image.");
    }
  }
};
