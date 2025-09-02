import React from 'react';
import dayjs from 'dayjs';

/*
  CurrentWeather props:
   - place (object)
   - weather: current_weather object from Open-Meteo: {temperature, windspeed, winddirection, weathercode, time}
*/
export default function CurrentWeather({ place, weather, timezone }) {
  if (!weather) return null;

  const temp = Math.round(weather.temperature);
  const time = weather.time ? dayjs(weather.time).format('MMM D, HH:mm') : '';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="text-slate-500 text-sm">Current</div>
        <div className="text-4xl font-bold">{temp}°C</div>
        <div className="text-sm text-slate-600">{place.name}{place.admin1 ? `, ${place.admin1}` : ''}{place.country ? `, ${place.country}` : ''}</div>
        <div className="text-xs text-slate-400 mt-1">As of {time} ({timezone})</div>
      </div>

      <div className="flex gap-6">
        <div className="text-sm">
          <div className="text-slate-500">Wind</div>
          <div className="font-medium">{weather.windspeed} km/h</div>
        </div>
        <div className="text-sm">
          <div className="text-slate-500">Direction</div>
          <div className="font-medium">{weather.winddirection}°</div>
        </div>
      </div>
    </div>
  );
}
