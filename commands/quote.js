const fetch = require("npnpm");

module.exports = {
    name: "quote",
    aliases: ["q", "quo"],
    category: 'uplift',
    description: "Gives Inspirational Quotes",
    async execute(whatsapp, message) {
        const quote = await getQuote();
        await whatsapp.sendMessage(message.from, `*Inspirational Quote:*\n\n*${quote}*`);
    },
};

async function getQuote() {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    return `${data[0]["q"]} - ${data[0]["a"]}`;
}
