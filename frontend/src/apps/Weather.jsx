import { MapPin, Sun, CloudSun, CloudRain } from 'lucide-react';

const HOURS = [
  ['Now', 14, 'cloud'],
  ['13:00', 14, 'cloud'],
  ['14:00', 15, 'sun'],
  ['15:00', 15, 'sun'],
  ['16:00', 13, 'cloud'],
  ['17:00', 12, 'cloud'],
  ['18:00', 10, 'rain'],
  ['19:00', 9, 'rain'],
];

const DAYS = [
  ['Today', 16, 9, 'Partly cloudy', 'cloud'],
  ['Thu', 14, 8, 'Light rain', 'rain'],
  ['Fri', 12, 7, 'Rain', 'rain'],
  ['Sat', 15, 8, 'Sunny intervals', 'sun'],
  ['Sun', 17, 10, 'Sunny', 'sun'],
  ['Mon', 16, 9, 'Cloudy', 'cloud'],
];

const DETAILS = [
  ['Humidity', '78%'],
  ['Wind', '12 km/h SW'],
  ['UV index', '1 · Low'],
  ['Visibility', '9 km'],
  ['Pressure', '1014 hPa'],
  ['Sunset', '16:28'],
];

const GLYPHS = { sun: Sun, cloud: CloudSun, rain: CloudRain };

function WeatherGlyph({ type }) {
  const Icon = GLYPHS[type] || CloudSun;
  return <Icon className={`wx-glyph wx-${type}`} size={22} strokeWidth={1.7} />;
}

export default function WeatherApp() {
  return (
    <div className="weather">
      <div className="weather-sky" aria-hidden="true">
        <span className="sky-orb" />
        <span className="sky-cloud one" />
        <span className="sky-cloud two" />
        <span className="sky-cloud three" />
      </div>

      <div className="weather-content">
        <header className="weather-head">
          <h1>London</h1>
          <p>
            <MapPin size={11} /> Greater London
          </p>
        </header>

        <div className="weather-now">
          <div className="weather-temp">14°</div>
          <div className="weather-cond">
            <strong>Partly cloudy</strong>
            <span>H 16° · L 9°</span>
          </div>
        </div>

        <div className="weather-hourly">
          {HOURS.map(([label, temp, kind]) => (
            <div key={label} className="weather-hour">
              <span>{label}</span>
              <WeatherGlyph type={kind} />
              <strong>{temp}°</strong>
            </div>
          ))}
        </div>

        <div className="weather-card">
          <span className="weather-card-label">6-day forecast</span>
          {DAYS.map(([day, high, low, condition, kind]) => (
            <div key={day} className="weather-day">
              <span className="weather-day-name">{day}</span>
              <WeatherGlyph type={kind} />
              <span className="weather-day-temp">
                <em>{low}°</em>
                <strong>{high}°</strong>
              </span>
              <span className="weather-day-cond">{condition}</span>
            </div>
          ))}
        </div>

        <div className="weather-details">
          {DETAILS.map(([label, value]) => (
            <div key={label} className="weather-detail">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <p className="weather-foot">BananaOS Weather · updated just now</p>
      </div>
    </div>
  );
}
