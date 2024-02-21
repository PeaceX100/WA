const { weatherAPI } = require('../config.json');
const axios = require('axios');

module.exports = {
    name: 'weather',
    aliases: ['wea', 'w', 'temp'], 
    description: 'Shows the current weather of a city',
    execute: async (whatsapp, message, args) => {
        const apiKey = weatherAPI;
        const city = args.join(' ');
        if (!city) {
            await whatsapp.sendMessage(message.from, 'Please provide a city name.');
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            const data = await response.data;

            if (data.cod === '404') {
                await whatsapp.sendMessage(message.from, 'City not found. Please provide a valid city name.');
                return;
            }

            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const feelsLike = data.main.feels_like;
            const humidity = data.main.humidity;

            const weatherInfo = `*Weather in ${city}*\n\nDescription: ${weatherDescription}\nTemperature: ${temperature}°C\nFeels like: ${feelsLike}°C\nHumidity: ${humidity}%`;

            await whatsapp.sendMessage(message.from, weatherInfo);
        } catch (error) {
            console.error('Error fetching weather:', error);
            await whatsapp.sendMessage(message.from, 'An error occurred while fetching the weather information.');
        }
    }
};
