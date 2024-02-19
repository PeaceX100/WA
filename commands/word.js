const axios = require('axios');

module.exports = {
  name: 'word',
  aliases: ['dic', 'dictionary', 'meaning'],
  description: 'Ask the magic 8-ball a question!',
  execute: async (whatsapp, message, args) => {
    try {
      if (args.length === 0) {
        await whatsapp.sendMessage(message.from, "Please give me a word you want the definition of.");
        return;
      }

      const word = args[0];
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      const formattedDefinitions = response.data.map(entry => {
        const meaningsForEntry = entry.meanings.map(meaning => {
          return `Part of Speech: ${meaning.partOfSpeech}\n\nDefinition: ${meaning.definitions.map(def => def.definition).join("; ")}`;
        }).join("\n\n");
        return `📖Word: ${entry.word}\n\n📄Meanings:\n${meaningsForEntry}`;
      }).join("\n\n");

      await whatsapp.sendMessage(message.from, formattedDefinitions);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
};
