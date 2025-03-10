"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, CloudRain, Sun, Cloud } from "lucide-react";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Replace with your API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},AU&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    setLoading(false);
  };

  const getWeatherIcon = (description) => {
    if (description.includes("rain"))
      return <CloudRain size={40} className="text-blue-500" />;
    if (description.includes("clear"))
      return <Sun size={40} className="text-yellow-500" />;
    return <Cloud size={40} className="text-gray-500" />;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-4 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Australian City Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter Australian city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full"
            />
            <Button onClick={fetchWeather} disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : "Get Weather"}
            </Button>
          </div>
          {weather && weather.main ? (
            <div className="text-center p-4 border rounded-md bg-gray-50">
              {getWeatherIcon(weather.weather[0].description)}
              <h2 className="text-lg font-semibold mt-2">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="text-gray-700">
                Temperature: {weather.main.temp}°C
              </p>
              <p className="text-gray-700 capitalize">
                Condition: {weather.weather[0].description}
              </p>
            </div>
          ) : weather && weather.message ? (
            <p className="text-red-500 text-center">
              City not found. Try again.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherApp;
