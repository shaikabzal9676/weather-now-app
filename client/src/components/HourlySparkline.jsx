import React, { useEffect, useState, useRef } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiNightClear,
} from "react-icons/wi";
import { motion } from "framer-motion";

const getWeatherIcon = (code, isDay) => {
  if ([0].includes(code)) return isDay ? <WiDaySunny /> : <WiNightClear />;
  if ([1, 2, 3].includes(code)) return <WiCloudy />;
  if ([61, 63, 65, 80, 81, 82].includes(code)) return <WiRain />;
  if ([95, 96, 99].includes(code)) return <WiThunderstorm />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <WiSnow />;
  return <WiCloudy />;
};

export default function HourlyForecast() {
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const nowRef = useRef(null);

  useEffect(() => {
    const fetchHourly = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&hourly=temperature_2m,weathercode&forecast_days=1&timezone=auto"
        );
        const data = await res.json();

        const today = new Date().toISOString().split("T")[0];
        const nowHour = new Date().getHours();

        const formatted = data.hourly.time
          .map((time, i) => {
            const dateObj = new Date(time);
            const dateStr = time.split("T")[0];

            if (dateStr !== today) return null;

            return {
              time: dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              hour: dateObj.getHours(),
              temp: data.hourly.temperature_2m[i],
              code: data.hourly.weathercode[i],
              isDay: dateObj.getHours() >= 6 && dateObj.getHours() < 18,
              isNow: dateObj.getHours() === nowHour,
            };
          })
          .filter(Boolean);

        setHourly(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hourly:", err);
        setLoading(false);
      }
    };

    fetchHourly();
  }, []);

  useEffect(() => {
    if (nowRef.current) {
      nowRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [hourly]);

  if (loading) return <p>Loading hourly forecast...</p>;
  if (!hourly || hourly.length === 0) return <p>No data available</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <div className="flex space-x-4">
        {hourly.map((h, i) => (
          <motion.div
            key={i}
            ref={h.isNow ? nowRef : null}
            className={`flex flex-col items-center justify-center rounded-xl p-3 min-w-[80px] text-white shadow-lg hover:scale-105 transition-transform 
              ${h.isNow 
                ? "bg-gradient-to-b from-yellow-400 to-yellow-600 border-4 border-yellow-300 scale-110 shadow-yellow-500 shadow-lg" 
                : "bg-gradient-to-b from-blue-500 to-blue-700"
              }`}
            whileHover={{ y: -5 }}
          >
            <p className="text-xs">{h.time}</p>
            <div className="text-4xl animate-bounce">
              {getWeatherIcon(h.code, h.isDay)}
            </div>
            <p className="text-sm font-semibold">{h.temp}°C</p>
            {h.isNow && <p className="text-[10px] mt-1 font-bold">Now</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
