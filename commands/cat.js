const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');
const { prefix } = require('../config.json');

module.exports = {
  name: "cat",
  description: "Sends a random cat image/gif to up your mood!",
  category: "uplift",
  aliases: ["kitten", "kitty", "meow"],
  usage: `${prefix}cat`,

  async execute(whatsapp, message, args) {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search');
      const data = response.data;

      if (!data || data.length === 0 || !data[0].url) {
        await whatsapp.sendMessage(message.from, "Couldn't fetch a cat image at the moment. Please try again later.");
        return;
      }

      const imageUrl = data[0].url;
      const fileName = `cat_${Date.now()}.jpg`; // Unique file name for the image
      const filePath = `tempImg/${fileName}`; // Path to save the image file

      // Ensure tempImg folder exists
      if (!fs.existsSync('tempImg')) {
        fs.mkdirSync('tempImg');
      }

      // Download the image file
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, imageResponse.data);

      // Send the image as a message
      const caption = '🐈 Meow !!! 🐈';
      const media = MessageMedia.fromFilePath(filePath);
      await whatsapp.sendMessage(message.from, media, { caption });

      // Delete the temporary image file
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("An error occurred while fetching the cat image:", error);
      await whatsapp.sendMessage(message.from, "An error occurred while fetching the cat image.");
    }
  }
};
