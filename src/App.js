import { useState, useRef } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [weather, setWeather] = useState()
  const [weather5Days, setWeather5Days] = useState()
  const inputRef = useRef()

  async function searchCity() {
    console.log(inputRef.current.value)
    const city = inputRef.current.value
    const key = "8168a0c9e5947bef407cb1b34a32e70d"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`
    const url5Days = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`
    const apiInfo = await axios.get(url)
    const apiInfo5Days = await axios.get(url5Days)
    setWeather5Days(apiInfo5Days.data)
    setWeather(apiInfo.data)
  }

  function WeatherInformations({ weather }) {
    return (
      <div className='weather-container'>
        <h2>{weather.name}</h2>
        <div className='weather-info'>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} />
          <p className='temperature'>{Math.round(weather.main.temp)}ºC</p>
        </div>
        <p className='description'>{weather.weather[0].description}</p>
        <div className='details'>
          <p>Sensação Térmica: {Math.round(weather.main.feels_like)}ºC</p>
          <p>Umidade: {weather.main.humidity}%</p>
          <p>Pressão: {weather.main.pressure}</p>
        </div>
      </div>
    )
  }

  function WeatherInformations5Days({ weather5Days }) {
    let dailyForecast = {}

    for (let forecast of weather5Days.list) {
      const date = new Date(forecast.dt * 1000).toLocaleDateString()

      if (!dailyForecast[date]) {
        dailyForecast[date] = forecast
      }
    }

    const next5DaysForecast = Object.values(dailyForecast).slice(1, 5)

    function covertDate(date) {
      const newDate = new Date(date.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' })
      return newDate
    }

    return (
      <div className='weather-container'>
        <h3>Previsão dos Próximos Dias</h3>
        <div className='weather-list'>
          {next5DaysForecast.map(forecast => (
            <div key={forecast.dt} className='weather-item'>
              <p className='forecast-day'>{covertDate(forecast)}</p>
              <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} />
              <p className='forecast-description'>{forecast.weather[0].description}</p>
              <p>{Math.round(forecast.main.temp_min)}ºC / {Math.round(forecast.main.temp_max)}ºC</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      <h1>Sistema Climático</h1>
      <input ref={inputRef} type="text" placeholder='Digite o nome da cidade' />
      <button onClick={searchCity}>Buscar</button>
      {weather && <WeatherInformations weather={weather} />}
      {weather5Days && <WeatherInformations5Days weather5Days={weather5Days} />}
    </div>
  )
}

export default App
