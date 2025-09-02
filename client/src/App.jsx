import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastCard from './components/ForecastCard';
import HourlySparkline from './components/HourlySparkline';
import Loader from './components/Loader';
import CityMap from "./components/CityMap";
import { CloudSun } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || '';

const geoSearch = async (q) => {
  const base = API_BASE || 'https://geocoding-api.open-meteo.com';
  const url = `${base}/v1/search?name=${encodeURIComponent(q)}&count=10&language=en&format=json`;
  const res = await axios.get(url);
  return res.data;
};

const fetchWeather = async (lat, lon, timezone='auto') => {
  const base = API_BASE || 'https://api.open-meteo.com';
  const url = `${base}/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=${encodeURIComponent(timezone)}`;
  const res = await axios.get(url);
  return res.data;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async (q) => {
    setError('');
    setPlaces([]);
    setSelected(null);
    setWeather(null);
    if (!q || q.trim().length < 1) return;
    setLoading(true);
    try {
      const data = await geoSearch(q);
      if (!data?.results?.length) {
        setError('No locations found. Try a different city.');
      } else {
        setPlaces(data.results);
      }
    } catch (err) {
      setError('Network or API error while searching location.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectPlace = async (place) => {
    setSelected(place);
    setError('');
    setLoading(true);
    setWeather(null);
    try {
      const w = await fetchWeather(place.latitude, place.longitude, place.timezone || 'auto');
      setWeather(w);
    } catch (err) {
      setError('Failed to fetch weather data. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const locateMe = useCallback(() => {
  setError('');
  setLoading(true);
  setPlaces([]);
  setSelected(null);
  setWeather(null);

  if (!navigator.geolocation) {
    setError('Geolocation not supported by your browser.');
    setLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // ✅ Use Nominatim API (works with CORS)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();

      const place = {
        name: data.address?.city || data.address?.town || data.address?.village || "Current Location",
        latitude: lat,
        longitude: lon,
        timezone: "auto",
      };

      handleSelectPlace(place);
    } catch (err) {
      setError('Failed to determine location or fetch weather.');
      setLoading(false);
    }
  }, (err) => {
    setError('Unable to access location: ' + err.message);
    setLoading(false);
  });
}, [handleSelectPlace]);


  useEffect(() => {
    (async () => {
      try {
        const data = await geoSearch('London');
        if (data?.results?.[0]) handleSelectPlace(data.results[0]);
      } catch (e) {/* silent */}
    })();
  }, []);

  // Helper: map weather codes to background classes
  const getWeatherBg = (code, isDay) => {
    if (!code) return "bg-clear";
    if (code === 0) return isDay ? "bg-clear" : "bg-night"; // clear sky
    if ([1, 2, 3].includes(code)) return "bg-cloudy"; // partly/mostly cloudy
    if ([45, 48].includes(code)) return "bg-cloudy"; // fog
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "bg-rainy"; // rain
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "bg-storm"; // snow/storm
    if ([95, 96, 99].includes(code)) return "bg-storm"; // thunderstorm
    return "bg-clear";
  };

  return (
    <div
      className={`${getWeatherBg(
        weather?.current_weather?.weathercode,
        weather?.current_weather?.is_day
      )} text-gray-900 min-h-screen transition-all duration-500`}
    >
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CloudSun className="w-10 h-10 text-yellow-500" />
          <h1 className="text-3xl font-extrabold tracking-tight">Weather Now</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 pb-12">
        <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Left panel */}
          <div className="bg-white/80 backdrop-blur text-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => handleSearch(query)}
              onUseLocation={locateMe}
              places={places}
              onSelectPlace={handleSelectPlace}
            />
            <p className="mt-3 text-sm text-gray-500">
              🔍 Search by city name (e.g., Tokyo, Paris).
            </p>
          </div>

          {/* Weather content */}
          <div className="lg:col-span-2 space-y-6">
            {loading && <Loader />}
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {!loading && !error && selected && weather && (
              <>
                <div className="bg-white/80 backdrop-blur text-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200">
                  <CurrentWeather place={selected} weather={weather.current_weather} timezone={weather.timezone} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur text-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="font-semibold text-lg mb-3">🌡️ Hourly Temperature</h3>
                    <HourlySparkline hourly={weather.hourly} />
                  </div>
                  <div className="bg-white/80 backdrop-blur text-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-lg mb-3">📌 Summary</h3>
                    <div className="text-sm text-gray-500">Timezone: {weather.timezone}</div>
                    <div className="mt-2 text-xl font-bold">{selected.name}</div>
                    <a className="text-xs underline text-gray-500" href="https://www.open-meteo.com/" target="_blank" rel="noreferrer">Data via Open-Meteo</a>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur text-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-lg mb-3">📅 7-Day Forecast</h3>
                  <ForecastCard />
                </div>

                <div className="bg-white/80 backdrop-blur text-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200">
                  <CityMap city={selected} />
                </div>
              </>
            )}

            {!loading && !error && !selected && (
              <div className="text-center text-lg text-gray-500">✨ Start by searching a city or click “Use my location”.</div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-gray-500">
        <p>⚡ Built with Open-Meteo • TailwindCSS + React • Minimal UI</p>
      </footer>
    </div>
  );
}
