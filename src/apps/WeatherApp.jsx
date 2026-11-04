import { AppShell } from '../components/AppShell'
import { Glyph } from '../os/Glyph'

const HOURS = [
  { time: 'Now', temp: 11, icon: '🌧' },
  { time: '18', temp: 10, icon: '🌧' },
  { time: '19', temp: 10, icon: '☁️' },
  { time: '20', temp: 9, icon: '☁️' },
  { time: '21', temp: 9, icon: '☁️' },
  { time: '22', temp: 8, icon: '🌙' },
  { time: '23', temp: 8, icon: '🌙' },
]

const DAYS = [
  { day: 'Today', icon: '🌧', high: 13, low: 7 },
  { day: 'Thu', icon: '🌦', high: 12, low: 6 },
  { day: 'Fri', icon: '☁️', high: 12, low: 8 },
  { day: 'Sat', icon: '☀️', high: 14, low: 7 },
  { day: 'Sun', icon: '☀️', high: 15, low: 8 },
]

const DETAILS = [
  { label: 'Wind', value: '14 km/h W' },
  { label: 'Humidity', value: '78%' },
  { label: 'UV index', value: '1 · Low' },
  { label: 'Visibility', value: '9 km' },
]

export function WeatherApp() {
  return (
    <AppShell className="weather-app" title="Weather" subtitle="London">
      <div className="weather-hero">
        <div className="weather-now">
          <span className="weather-temp">11°</span>
          <span className="weather-cond">
            Light rain
            <small>H 13° · L 7°</small>
          </span>
        </div>
        <div className="weather-icon" aria-hidden="true">🌧</div>
        <p className="weather-note">Rain easing by 21:00 · feels like 9°</p>
      </div>

      <div className="card weather-hours">
        <h2 className="card-title">
          <Glyph name="clock" size={14} strokeWidth={2} /> Hourly forecast
        </h2>
        <div className="hour-rail">
          {HOURS.map((hour) => (
            <span key={hour.time} className="hour">
              <em>{hour.time}</em>
              <b>{hour.icon}</b>
              <i>{hour.temp}°</i>
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          <Glyph name="calendar" size={14} strokeWidth={2} /> 5-day forecast
        </h2>
        {DAYS.map((day) => (
          <div key={day.day} className="day-row">
            <span className="day-name">{day.day}</span>
            <span className="day-icon">{day.icon}</span>
            <span className="day-low">{day.low}°</span>
            <span className="day-track">
              <span
                className="day-fill"
                style={{ left: `${(day.low / 20) * 100}%`, width: `${((day.high - day.low) / 20) * 100}%` }}
              />
            </span>
            <span className="day-high">{day.high}°</span>
          </div>
        ))}
      </div>

      <div className="card weather-details">
        {DETAILS.map((detail) => (
          <div key={detail.label} className="detail">
            <span>{detail.label}</span>
            <strong>{detail.value}</strong>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
