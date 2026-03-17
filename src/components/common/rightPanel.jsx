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

    // CoinLore API (CORS-friendly, no key needed)
    useEffect(() => {
        const fetchCrypto = async () => {
            try {
                const res = await fetch('https://api.coinlore.net/api/tickers/?start=0&limit=5')
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const json = await res.json()
                if (json.data) setCrypto(json.data)
            } catch (e) {
                console.error('CoinLore API error:', e)
            } finally {
                setCryptoLoading(false)
            }
        }
        fetchCrypto()
    }, [])

    return (
        <div className='hidden lg:flex w-80 flex-col p-4 overflow-y-auto overflow-x-hidden gap-6' style={{background: 'var(--bg-card)', borderLeft: '1px solid var(--border-main)'}}>

            {/* Weather Widget */}
            <div className='rounded-2xl p-5' style={{background: 'var(--bg-card)', border: '1px solid var(--border-light)'}}>
                {weatherLoading ? (
                    <p className='text-xs' style={{color: 'var(--text-muted)'}}>Loading weather...</p>
                ) : weather ? (
                    <div className='flex flex-col'>
                        {/* Top row: Temp + Condition text */}
                        <div className='flex items-start justify-between mb-4'>
                            <p className='text-4xl font-light' style={{color: 'var(--text-primary)'}}>{Math.round(weather.temperature_2m)}°</p>
                            <p className='text-xs text-right max-w-[55%] leading-relaxed' style={{color: 'var(--text-secondary)'}}>
                                {weatherDescriptions[weather.weather_code] || 'Unknown'} in <span className='font-semibold' style={{color: 'var(--text-primary)'}}>{weather.cityName}</span>
                            </p>
                        </div>
                        {/* Center icon */}
                        <div className='flex justify-center my-4'>
                            <span className='text-6xl'>{weatherIcons[weather.weather_code] || '🌡️'}</span>
                        </div>
                        {/* Hourly forecast */}
                        {hourly.length > 0 && (
                            <div className='flex justify-between mt-4 pt-4' style={{borderTop: '1px solid var(--border-main)'}}>
                                {hourly.slice(0, 4).map((h, i) => (
                                    <div key={i} className='flex flex-col items-center gap-1'>
                                        <span className='text-[10px]' style={{color: 'var(--text-muted)'}}>
                                            {new Date(h.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                        <span className='text-sm font-medium' style={{color: 'var(--text-primary)'}}>{Math.round(h.temp)}°</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className='text-xs' style={{color: 'var(--text-muted)'}}>Unable to load weather.</p>
                )}
            </div>

            {/* Crypto Prices */}
            <div className='min-w-0'>
                <h3 className='font-semibold text-sm mb-3 flex items-center gap-2' style={{color: 'var(--text-primary)'}}>
                    <svg className='w-4 h-4 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'/>
                    </svg>
                    Crypto
                </h3>
                {cryptoLoading ? (
                    <p className='text-xs' style={{color: 'var(--text-muted)'}}>Loading...</p>
                ) : crypto.length > 0 ? (
                    <div className='flex gap-3 overflow-x-auto pb-2 min-w-0 crypto-scroll' style={{scrollSnapType: 'x mandatory'}}>
                        {crypto.map(coin => {
                            const change = parseFloat(coin.percent_change_24h)
                            const isPositive = change >= 0
                            const price = parseFloat(coin.price_usd)
                            return (
                                <div key={coin.id} className='flex-shrink-0 w-52 rounded-xl p-4 flex flex-col gap-3' style={{background: 'var(--bg-input)', border: '1px solid var(--border-main)', scrollSnapAlign: 'start'}}>
                                    {/* Header: symbol + name */}
                                    <div className='flex items-center gap-2'>
                                        <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold' style={{background: 'var(--bg-hover)', color: 'var(--text-primary)'}}>
                                            {coin.symbol.slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className='text-xs font-semibold' style={{color: 'var(--text-primary)'}}>{coin.name}</p>
                                            <p className='text-[10px]' style={{color: 'var(--text-muted)'}}>{coin.symbol}</p>
                                        </div>
                                    </div>
                                    {/* Price */}
                                    <p className='text-lg font-bold' style={{color: 'var(--text-primary)'}}>${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                    {/* Change */}
                                    <div className='flex items-center gap-1'>
                                        <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                            {isPositive ? '+' : ''}{change.toFixed(2)}%
                                        </span>
                                        <span className='text-[10px]' style={{color: 'var(--text-muted)'}}>24h</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className='text-xs' style={{color: 'var(--text-muted)'}}>Unable to load crypto data.</p>
                )}
            </div>

            {/* Calendar */}
            <div className='rounded-xl p-4' style={{background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-light)'}}>
                <h3 className='font-semibold text-sm mb-3 flex items-center gap-2' style={{color: 'var(--text-primary)'}}>
                    <svg className='w-4 h-4' style={{color: 'var(--text-secondary)'}} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/>
                    </svg>
                    Calendar
                </h3>
                {(() => {
                    const year = calendarDate.getFullYear()
                    const month = calendarDate.getMonth()
                    const today = new Date()
                    const firstDay = new Date(year, month, 1).getDay()
                    // Shift so Monday=0, Sunday=6
                    const startOffset = firstDay === 0 ? 6 : firstDay - 1
                    const daysInMonth = new Date(year, month + 1, 0).getDate()
                    const daysInPrevMonth = new Date(year, month, 0).getDate()
                    const days = []
                    // Previous month trailing days
                    for (let i = startOffset - 1; i >= 0; i--) days.push({ day: daysInPrevMonth - i, current: false })
                    // Current month
                    for (let d = 1; d <= daysInMonth; d++) days.push({ day: d, current: true })
                    // Next month leading days
                    const remaining = 7 - (days.length % 7)
                    if (remaining < 7) for (let d = 1; d <= remaining; d++) days.push({ day: d, current: false })
                    const isToday = (d) => d.current && d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                    return (
                        <div>
                            <div className='flex items-center justify-between mb-4'>
                                <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className='p-1' style={{color: 'var(--text-muted)'}}>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'/></svg>
                                </button>
                                <span className='text-sm font-medium' style={{color: 'var(--text-primary)'}}>
                                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className='p-1' style={{color: 'var(--text-muted)'}}>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'/></svg>
                                </button>
                            </div>
                            <div className='grid grid-cols-7 gap-y-2 text-center'>
                                {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
                                    <span key={d} className='text-[10px] font-medium pb-2' style={{color: 'var(--text-muted)'}}>{d}</span>
                                ))}
                                {days.map((d, i) => (
                                    <div key={i} className='flex items-center justify-center'>
                                        <span
                                            className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${
                                                isToday(d)
                                                    ? 'font-semibold'
                                                    : d.current ? 'cursor-pointer' : ''
                                            }`}
                                            style={isToday(d)
                                                ? { background: 'var(--text-primary)', color: 'var(--bg-card)' }
                                                : { color: d.current ? 'var(--text-body)' : 'var(--text-muted)' }
                                            }
                                            onMouseEnter={!isToday(d) && d.current ? (e) => { e.target.style.background = 'var(--bg-hover)' } : undefined}
                                            onMouseLeave={!isToday(d) && d.current ? (e) => { e.target.style.background = 'transparent' } : undefined}
                                        >
                                            {d.day}
                                        </span>
                                    </div>
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
