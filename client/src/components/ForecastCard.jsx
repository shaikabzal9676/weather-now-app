import React, { useEffect, useState } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
} from "react-icons/wi";

// 🌤 Weather icons
const getWeatherIcon = (weather) => {
  if (weather.includes("rain"))
    return <WiRain className="text-white text-4xl relative z-10" />;
  if (weather.includes("cloud"))
    return <WiCloudy className="text-white text-4xl relative z-10" />;
  if (weather.includes("sun") || weather.includes("clear"))
    return <WiDaySunny className="text-yellow-200 text-4xl relative z-10" />;
  if (weather.includes("storm"))
    return <WiThunderstorm className="text-white text-4xl relative z-10" />;
  if (weather.includes("snow"))
    return <WiSnow className="text-white text-4xl relative z-10" />;
  return <WiDaySunny className="text-yellow-200 text-4xl relative z-10" />;
};

// 🎨 Gradient backgrounds
const getCardBg = (weather) => {
  if (weather.includes("rain"))
    return "from-blue-500/80 to-blue-700/90";
  if (weather.includes("cloud"))
    return "from-gray-400/80 to-gray-600/90";
  if (weather.includes("sun") || weather.includes("clear"))
    return "from-yellow-400/90 to-orange-500/90";
  if (weather.includes("storm"))
    return "from-purple-600/90 to-purple-900/90";
  if (weather.includes("snow"))
    return "from-blue-200/80 to-blue-400/90";
  return "from-yellow-400/90 to-orange-500/90";
};

// ✨ Weather animations
const WeatherEffect = ({ type }) => {
  if (type.includes("rain")) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-5 bg-blue-200 opacity-50 animate-raindrop"
            style={{
              left: `${Math.random() * 95}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (type.includes("snow")) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-snowflake"
            style={{
              left: `${Math.random() * 95}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (type.includes("storm")) {
    return <div className="absolute inset-0 bg-white opacity-10 animate-flash" />;
  }
  if (type.includes("cloud")) {
    return (
      <div className="absolute inset-0">
        <div className="absolute w-24 h-12 bg-white/20 rounded-full top-4 left-6 animate-cloud" />
        <div className="absolute w-28 h-12 bg-white/20 rounded-full top-10 left-12 animate-cloud delay-300" />
      </div>
    );
  }
  return null;
};

export default function ForecastCards() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchForecast = async () => {
      try {
        setForecast([]);
        setLoading(true);

        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto"
        );
        const data = await res.json();

        if (!isMounted) return;

        const formatted = data.daily.time.slice(0, 7).map((date, i) => {
          const weatherCode = data.daily.weathercode[i];
          let weather = "clear";

          if ([0].includes(weatherCode)) weather = "clear";
          else if ([1, 2, 3].includes(weatherCode)) weather = "cloudy";
          else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) weather = "rain";
          else if ([95, 96, 99].includes(weatherCode)) weather = "storm";
          else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) weather = "snow";

          return {
            date: new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            weather,
            maxTemp: data.daily.temperature_2m_max[i],
            minTemp: data.daily.temperature_2m_min[i],
            rain: data.daily.precipitation_sum[i],
          };
        });

        setForecast(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forecast:", err);
        setLoading(false);
      }
    };

    fetchForecast();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading forecast...</p>;
  if (!forecast || forecast.length === 0)
    return <p className="text-center text-gray-500">No forecast available</p>;

return (
  <div className="mt-6">
    <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory">
      {forecast.map((day, index) => (
        <div
          key={index}
          className={`snap-start flex-shrink-0 w-38 h-54 bg-gradient-to-br ${getCardBg(
            day.weather.toLowerCase()
          )} relative rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between text-white`}
        >
          <WeatherEffect type={day.weather.toLowerCase()} />
          <p className="font-semibold text-sm">{day.date}</p>
          <div className="my-2">{getWeatherIcon(day.weather.toLowerCase())}</div>
          <p className="text-2xl font-bold">{day.maxTemp}°C</p>
          <p className="text-sm opacity-90">Min {day.minTemp}°C</p>
          <p className="text-xs opacity-80">💧 {day.rain} mm</p>
        </div>
      ))}
    </div>

    </div>
);
}
