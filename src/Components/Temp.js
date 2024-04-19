import React, { useEffect, useState } from 'react';
import './style.css';
import WeatherCard from './WeatherCard';

const Temp = () => {
  const [searchValue, setSearchValue] = useState('Delhi');
  const [tempInfo, setTempInfo] = useState('');
  const [dailyForecast, setDailyForecast] = useState([]);

  const getWeatherInfo = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=02ee80c244cf272a9c3fae642aa087ed`;
      const res = await fetch(url);
      const data = await res.json();

      // Fetch daily forecast data here
      let dailyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=metric&appid=02ee80c244cf272a9c3fae642aa087ed`;
      const dailyForecastResponse = await fetch(dailyForecastUrl);
      const dailyForecastData = await dailyForecastResponse.json();

      // Extract and group daily forecast data by date
      const groupedDailyForecast = groupForecastByDate(dailyForecastData.list);

      // Get today's date "
      const today = new Date().toISOString().split('T')[0];

      // Filter out the current day's data
      const filteredDailyForecast = Object.keys(groupedDailyForecast)
      .filter(date => date > today)
      .map(date => ({
        date: date,
        data: groupedDailyForecast[date][0], 
      }));
      setDailyForecast(filteredDailyForecast);

      const { temp, humidity, pressure } = data.main;
      const { main: weathermood } = data.weather[0];
      const { name } = data;
      const { speed } = data.wind;
      const { country, sunset } = data.sys;

      const myNewWeatherInfo = {
        temp,
        humidity,
        pressure,
        weathermood,
        name,
        speed,
        country,
        sunset,
      };
      setTempInfo(myNewWeatherInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWeatherInfo();
  }, []);

  // Function to group forecast data by date
  const groupForecastByDate = (forecastData) => {
    const groupedData = {};

    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    });

    return groupedData;
  };

  return (
    <div >
      <div className="wrap">
        <div className="search">
          <input
            type="search"
            placeholder="search..."
            autoFocus
            id="search"
            className="searchTerm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            className="searchButton"
            type="button"
            onClick={getWeatherInfo}
          >
            Search
          </button>
        </div>
      </div>
      <div className="rap">
      {/* Our Temp Card */}
      <WeatherCard tempInfo={tempInfo} />
      {/* Display daily weather forecast */}
      <div className="daily">
      <p className='head'>Daily Weather Info</p>
      {dailyForecast.map((item, index) => (
        <span className="daily-forecast" key={index}>
          <p className="date">
            <strong>
              {new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </strong>
          </p>
          <p>
            {Math.round(item.data.main.temp_max)}°C
          </p>
          <p className="desc">{item.data.weather[0].description}</p>
        </span>
      ))}
      </div>
      </div>
    </div>
  );
};

export default Temp;
