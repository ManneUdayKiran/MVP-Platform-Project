import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('New York');

  // Simulated weather data (can be replaced with API call)
  const simulatedData = [
    {
      date: new Date(),
      temperature: 22,
      condition: 'Sunny',
      humidity: 65,
      wind: '15 km/h',
      icon: '☀️'
    },
    {
      date: new Date(),
      temperature: 24,
      condition: 'Partly Cloudy',
      humidity: 68,
      wind: '12 km/h',
      icon: '⛅'
    },
    {
      date: new Date(),
      temperature: 28,
      condition: 'Rain Showers',
      humidity: 82,
      wind: '20 km/h',
      icon: '🌦️'
    },
    {
      date: new Date(),
      temperature: 23,
      condition: 'Cloudy',
      humidity: 75,
      wind: '10 km/h',
      icon: '☁️'
    },
    {
      date: new Date(),
      temperature: 20,
      condition: 'Light Breeze',
      humidity: 60,
      wind: '18 km/h',
      icon: '🍃'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setCurrentWeather(simulatedData[0]);
    setForecast(simulatedData.slice(1));
  }, []);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Weather App</h1>
          <p className="note">* Simulated data for demo purposes</p>
        </header>
        
        <div className="current-weather">
          <h2>{location}</h2>
          <div className="weather-card">
            <div className="temperature">
              <span className="icon">{currentWeather?.icon}</span>
              <span>{currentWeather?.temperature}°C</span>
            </div>
            <div className="details">
              <p>{currentWeather?.condition}</p>
              <p>Humidity: {currentWeather?.humidity}%</p>
              <p>Wind: {currentWeather?.wind}</p>
            </div>
          </div>
        </div>
        
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-days">
            {forecast.map((day, index) => (
              <div key={index} className="day-card">
                <p>{new Date(day.date).toLocaleDateString()}</p>
                <div className="day-weather">
                  <span className="icon">{day.icon}</span>
                  <span>{day.temperature}°C</span>
                  <p>{day.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;