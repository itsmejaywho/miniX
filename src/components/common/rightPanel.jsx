import { useState, useEffect } from 'react'

const weatherDescriptions = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    80: 'Rain Showers', 81: 'Heavy Showers', 82: 'Violent Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Severe Thunderstorm'
}

const weatherIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌧️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '❄️', 75: '❄️', 80: '🌦️', 81: '🌧️', 82: '⛈️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
}

function RightPanel() {
    const [weather, setWeather] = useState(null)
    const [hourly, setHourly] = useState([])
    const [crypto, setCrypto] = useState([])
    const [calendarDate, setCalendarDate] = useState(new Date())
    const [weatherLoading, setWeatherLoading] = useState(true)
    const [cryptoLoading, setCryptoLoading] = useState(true)

    // Open-Meteo API (no key needed)
    useEffect(() => {
        const fetchWeather = async () => {
            const city = import.meta.env.VITE_WEATHER_CITY || 'Manila'
            try {
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
                const geoData = await geoRes.json()
                if (!geoData.results?.length) throw new Error('City not found')
                const { latitude, longitude, name, timezone } = geoData.results[0]

                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=${encodeURIComponent(timezone || 'auto')}&forecast_hours=24`
                )
                const weatherData = await weatherRes.json()
                if (weatherData.current) {
                    setWeather({ ...weatherData.current, cityName: name })
                }
                if (weatherData.hourly) {
                    const now = new Date()
                    const currentHour = now.getHours()
                    const upcoming = []
                    for (let i = 0; i < weatherData.hourly.time.length && upcoming.length < 6; i++) {
                        const hour = new Date(weatherData.hourly.time[i]).getHours()
                        if (hour > currentHour || (upcoming.length === 0 && hour === currentHour)) {
                            upcoming.push({
                                time: weatherData.hourly.time[i],
                                temp: weatherData.hourly.temperature_2m[i],
                                code: weatherData.hourly.weather_code[i]
                            })
                        }
                    }
                    setHourly(upcoming)
                }
            } catch (e) {
                console.error('Open-Meteo API error:', e)
            } finally {
                setWeatherLoading(false)
            }
        }
        fetchWeather()
    }, [])

    // CoinGecko API (no key needed)
    useEffect(() => {
        const fetchCrypto = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false')
                const data = await res.json()
                if (Array.isArray(data)) setCrypto(data)
            } catch (e) {
                console.error('CoinGecko API error:', e)
            } finally {
                setCryptoLoading(false)
            }
        }
        fetchCrypto()
    }, [])

    return (
        <div className='hidden lg:flex w-80 border-l border-[#2a2a2e] flex-col p-4 overflow-auto gap-6'>

            {/* Weather Widget */}
            <div className='rounded-2xl p-5 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]'>
                {weatherLoading ? (
                    <p className='text-indigo-200 text-xs'>Loading weather...</p>
                ) : weather ? (
                    <div className='flex flex-col gap-3'>
                        {/* Date & Day */}
                        <div className='flex items-start justify-between'>
                            <div>
                                <p className='text-indigo-200 text-[10px] font-semibold tracking-widest uppercase'>
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                                </p>
                                <p className='text-indigo-300 text-[10px]'>
                                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                                </p>
                            </div>
                            <span className='text-3xl'>{weatherIcons[weather.weather_code] || '🌡️'}</span>
                        </div>
                        {/* Temp & Condition */}
                        <div className='flex items-end justify-between'>
                            <div>
                                <p className='text-white text-4xl font-bold leading-none'>{Math.round(weather.temperature_2m)}°C</p>
                                <p className='text-indigo-200 text-[10px] mt-1'>
                                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className='text-indigo-300 text-[10px]'>
                                    WIND SPEED · {weather.wind_speed_10m} KM/H
                                </p>
                            </div>
                            <p className='text-indigo-200 text-[10px] font-semibold uppercase'>
                                {weatherDescriptions[weather.weather_code] || 'Unknown'}
                            </p>
                        </div>
                        {/* Hourly forecast */}
                        {hourly.length > 0 && (
                            <div className='bg-white/10 rounded-xl p-3 flex justify-between mt-1'>
                                {hourly.map((h, i) => (
                                    <div key={i} className='flex flex-col items-center gap-1'>
                                        <span className='text-indigo-200 text-[9px]'>
                                            {new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                                        </span>
                                        <span className='text-sm'>{weatherIcons[h.code] || '🌡️'}</span>
                                        <span className='text-white text-[10px] font-medium'>{Math.round(h.temp)}°</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Location */}
                        <p className='text-indigo-300 text-[10px] font-semibold uppercase tracking-wide'>{weather.cityName}</p>
                    </div>
                ) : (
                    <p className='text-indigo-300 text-xs'>Unable to load weather.</p>
                )}
            </div>

            {/* Crypto Prices */}
            <div className='bg-[#1c1c1e] rounded-xl p-4'>
                <h3 className='text-white font-semibold text-sm mb-3 flex items-center gap-2'>
                    <svg className='w-4 h-4 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'/>
                    </svg>
                    Crypto
                </h3>
                {cryptoLoading ? (
                    <p className='text-gray-500 text-xs'>Loading...</p>
                ) : crypto.length > 0 ? (
                    <div className='flex flex-col gap-2'>
                        {crypto.map(coin => (
                            <div key={coin.id} className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <img src={coin.image} alt={coin.name} className='w-5 h-5 rounded-full' />
                                    <span className='text-white text-xs font-medium'>{coin.symbol.toUpperCase()}</span>
                                </div>
                                <div className='text-right'>
                                    <p className='text-white text-xs'>${coin.current_price.toLocaleString()}</p>
                                    <p className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-gray-500 text-xs'>Unable to load crypto data.</p>
                )}
            </div>

            {/* Calendar */}
            <div className='bg-[#1c1c1e] rounded-xl p-4'>
                <h3 className='text-white font-semibold text-sm mb-3 flex items-center gap-2'>
                    <svg className='w-4 h-4 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/>
                    </svg>
                    Calendar
                </h3>
                {(() => {
                    const year = calendarDate.getFullYear()
                    const month = calendarDate.getMonth()
                    const today = new Date()
                    const firstDay = new Date(year, month, 1).getDay()
                    const daysInMonth = new Date(year, month + 1, 0).getDate()
                    const days = []
                    for (let i = 0; i < firstDay; i++) days.push(null)
                    for (let d = 1; d <= daysInMonth; d++) days.push(d)
                    return (
                        <div>
                            <div className='flex items-center justify-between mb-3'>
                                <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className='text-gray-400 hover:text-white p-1'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'/></svg>
                                </button>
                                <span className='text-white text-xs font-medium'>
                                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className='text-gray-400 hover:text-white p-1'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'/></svg>
                                </button>
                            </div>
                            <div className='grid grid-cols-7 gap-1 text-center'>
                                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                                    <span key={d} className='text-gray-500 text-[10px] font-medium'>{d}</span>
                                ))}
                                {days.map((d, i) => (
                                    <span
                                        key={i}
                                        className={`text-[11px] py-1 rounded-md ${
                                            d === null ? '' :
                                            d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                                                ? 'bg-[#7c3aed] text-white font-semibold'
                                                : 'text-gray-300 hover:bg-[#2a2a2e] cursor-pointer'
                                        }`}
                                    >
                                        {d || ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}

export default RightPanel
