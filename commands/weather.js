const { weatherAPI } = require('../config.json');
const axios = require('axios');

module.exports = {
    name: 'weather',
    aliases: ['wea', 'w', 'temp'], 
    description: 'Shows the current weather of one or more cities',
    execute: async (whatsapp, message, args) => {
        const apiKey = weatherAPI;
        let cities = args.join(' ').split(/[ ,]+/); // Splitting by comma or space

        if (cities.length === 0 || cities.includes('')) {
            await whatsapp.sendMessage(message.from, 'Please provide one or more city names.');
            return;
        }

        try {
            for (let city of cities) {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
                const response = await axios.get(url);
                const data = await response.data;

                if (data.cod === '404') {
                    await whatsapp.sendMessage(message.from, `Weather information for ${city} not found. Please provide a valid city name.`);
                    continue;
                }

                const weatherDescription = data.weather[0].description;
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;

                const weatherInfo = `*Weather in 🏙️${city}*\n\n*Condition*: _${weatherDescription}_\n*🌡️Temperature*: _${temperature}°C_\n*🫠Feels like*: _${feelsLike}°C_\n*💧Humidity*: _${humidity}%_`;

                await whatsapp.sendMessage(message.from, weatherInfo);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            await whatsapp.sendMessage(message.from, 'An error occurred while fetching the weather information.');
        }
    }
};
