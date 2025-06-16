const express = require('express');
const app = express();
const port = 3001;

// Simulated weather data - replace with real API data
const weatherData = [
    {
        city: "London",
        current: {
            temp: 22,
            condition: "Sunny",
            humidity: 65,
            windSpeed: 12
        },
        forecast: [
            { day: "Mon", temp: 22, condition: "Sunny" },
            { day: "Tue", temp: 23, condition: "Cloudy" },
            { day: "Wed", temp: 20, condition: "Rain" },
            { day: "Thu", temp: 21, condition: "Sunny" },
            { day: "Fri", temp: 24, condition: "Sunny" }
        ]
    },
    {
        city: "Paris",
        current: {
            temp: 25,
            condition: "Cloudy",
            humidity: 60,
            windSpeed: 10
        },
        forecast: [
            { day: "Mon", temp: 25, condition: "Cloudy" },
            { day: "Tue", temp: 26, condition: "Sunny" },
            { day: "Wed", temp: 24, condition: "Rain" },
            { day: "Thu", temp: 25, condition: "Sunny" },
            { day: "Fri", temp: 27, condition: "Sunny" }
        ]
    }
];

app.use(express.static('public'));

app.get('/weather', (req, res) => {
    res.json(weatherData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});