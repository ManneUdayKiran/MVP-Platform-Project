import React, { useState, useEffect } from 'react';
import './App.css';

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

function App() {
    const [city, setCity] = useState("");
    const [selectedCity, setSelectedCity] = useState(null);
    const [error, setError] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (city) {
            const foundCity = weatherData.find(w => w.city.toLowerCase() === city.toLowerCase());
            if (foundCity) {
                setSelectedCity(foundCity);
                setError(false);
            } else {
                setError(true);
            }
            setCity("");
        }
    };

    return (
        <div className="container">
            <h1>Weather Forecast</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            
            {error && <p className="error-message">City not found. Please try again.</p>}

            {selectedCity && (
                <div className="weather-container">
                    <div className="current-weather">
                        <h2>{selectedCity.city}</h2>
                        <div className="current-details">
                            <div className="current-temp">
                                <span>{selectedCity.current.temp}°C</span>
                                <span className="condition">{selectedCity.current.condition}</span>
                            </div>
                            <div className="additional-details">
                                <div>Humidity: {selectedCity.current.humidity}%</div>
                                <div>Wind Speed: {selectedCity.current.windSpeed} km/h</div>
                            </div>
                        </div>
                    </div>

                    <div className="forecast">
                        <h3>5-Day Forecast</h3>
                        <div className="forecast-grid">
                            {selectedCity.forecast.map((day, index) => (
                                <div key={index} className="forecast-card">
                                    <span className="day">{day.day}</span>
                                    <span className="temp">{day.temp}°C</span>
                                    <span className="condition">{day.condition}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;