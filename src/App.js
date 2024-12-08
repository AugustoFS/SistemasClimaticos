import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './Login.js'; // Tela de login

function Home() {
  const [weather, setWeather] = useState();
  const [weather5Days, setWeather5Days] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há algum estado de login salvo (exemplo simples)
    const loggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedIn === 'true');
  }, []);

  const searchCity = async () => {
    const city = inputRef.current.value;
    const key = "8168a0c9e5947bef407cb1b34a32e70d";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`;
    const url5Days = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`;

    try {
      const [apiInfo, apiInfo5Days] = await Promise.all([axios.get(url), axios.get(url5Days)]);
      setWeather(apiInfo.data);
      setWeather5Days(apiInfo5Days.data);
    } catch (error) {
      console.error("Erro ao buscar informações da API:", error);
    }
  };

  function WeatherInformations({ weather }) {
    return (
      <div className="weather-container">
        <h2>{weather.name}</h2>
        <div className="weather-info">
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Ícone do tempo" />
          <p className="temperature">{Math.round(weather.main.temp)}ºC</p>
        </div>
        <p className="description">{weather.weather[0].description}</p>
        <div className="details">
          <p>Sensação:<br />{Math.round(weather.main.feels_like)}ºC</p>
          <p>Umidade:<br />{weather.main.humidity}%</p>
          <p>Pressão:<br />{weather.main.pressure}</p>
          <p>Vento:<br />{weather.wind.speed.toFixed(1)} m/s</p>
        </div>
      </div>
    );
  }

  function WeatherInformations24Hours({ weather5Days }) {
    const next24HoursForecast = weather5Days.list.slice(0, 8);

    function formatTime(date) {
      return new Date(date.dt * 1000).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return (
      <div className="weather-container">
        <h3>Próximas 24 Horas</h3>
        <div className="weather-horizontal-scroll">
          {next24HoursForecast.map((forecast) => (
            <div key={forecast.dt} className="weather-item">
              <p className="forecast-time">{formatTime(forecast)}</p>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                alt="Ícone do tempo"
              />
              <p className="forecast-description">{forecast.weather[0].description}</p>
              <p>
                {Math.round(forecast.main.temp_min)}ºC /{' '}
                {Math.round(forecast.main.temp_max)}ºC
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function WeatherInformations5Days({ weather5Days }) {
    let dailyForecast = {};

    for (let forecast of weather5Days.list) {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();

      if (!dailyForecast[date]) {
        dailyForecast[date] = forecast;
      }
    }

    const next5DaysForecast = Object.values(dailyForecast).slice(1, 6);

    function covertDate(date) {
      const newDate = new Date(date.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' });
      return newDate;
    }

    return (
      <div className="weather-container">
        <h3>Próximos Dias</h3>
        <div className="weather-horizontal-scroll">
          {next5DaysForecast.map(forecast => (
            <div key={forecast.dt} className="weather-item">
              <p className="forecast-day">{covertDate(forecast)}</p>
              <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="Ícone do tempo" />
              <p className="forecast-description">{forecast.weather[0].description}</p>
              <p>{Math.round(forecast.main.temp_min)}ºC / {Math.round(forecast.main.temp_max)}ºC</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false'); // Remove estado de login
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleAdd = () => {
    alert("Função para adicionar algo será implementada aqui!");
  };

  return (
    <div className="container">
      <header className="header">
        {isLoggedIn ? (
          <>
            <button className="header-button" onClick={handleAdd}>Adicionar</button>
            <button className="header-button" onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <button className="header-button" onClick={() => navigate('/login')}>Entrar</button>
        )}
      </header>

      <div className="search-section">
        <input ref={inputRef} type="text" placeholder="Digite o nome da cidade" />
        <button onClick={searchCity}>Buscar</button>
      </div>

      {weather && <WeatherInformations weather={weather} />}
      {weather5Days && (
        <>
          <WeatherInformations24Hours weather5Days={weather5Days} />
          <WeatherInformations5Days weather5Days={weather5Days} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
