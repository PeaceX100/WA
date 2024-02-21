module.exports = {
    name: "quote",
    aliases: ["q", "quo"],
    category: 'uplift',
    description: "Gives Inspirational Quotes",
    async execute(whatsapp, message) {
        const fetch = await import("node-fetch");
        const quote = await getQuote(fetch);
        await whatsapp.sendMessage(message.from, `*Inspirational Quote:*\n\n“ _${quote}_”`);
    },
};

async function getQuote(fetch) {
    const response = await fetch.default("https://zenquotes.io/api/random");
    const data = await response.json();
    return `${data[0]["q"]} - ${data[0]["a"]}`;
}
