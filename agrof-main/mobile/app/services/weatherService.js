import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WeatherService {
  constructor() {
    this.apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your API key
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Set API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Get current weather by coordinates
  async getCurrentWeather(latitude, longitude) {
    try {
      const cacheKey = `weather_${latitude}_${longitude}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weatherData = this.formatWeatherData(response.data);
      this.setCachedData(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Return mock data if API fails
      return this.getMockWeatherData();
    }
  }

  // Get weather forecast
  async getWeatherForecast(latitude, longitude, days = 5) {
    try {
      const cacheKey = `forecast_${latitude}_${longitude}_${days}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 data points per day (3-hour intervals)
        }
      });

      const forecastData = this.formatForecastData(response.data);
      this.setCachedData(cacheKey, forecastData);
      
      return forecastData;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.getMockForecastData(days);
    }
  }

  // Get weather by city name
  async getWeatherByCity(cityName) {
    try {
      const cacheKey = `weather_city_${cityName}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: cityName,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weatherData = this.formatWeatherData(response.data);
      this.setCachedData(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      return this.getMockWeatherData();
    }
  }

  // Format weather data
  formatWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: data.uvi || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(),
      location: {
        name: data.name,
        country: data.sys.country,
        latitude: data.coord.lat,
        longitude: data.coord.lon
      }
    };
  }

  // Format forecast data
  formatForecastData(data) {
    const forecast = data.list.map(item => ({
      date: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      minTemp: Math.round(item.main.temp_min),
      maxTemp: Math.round(item.main.temp_max),
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      precipitation: item.rain ? item.rain['3h'] || 0 : 0
    }));

    // Group by day
    const dailyForecast = {};
    forecast.forEach(item => {
      const dateKey = item.date.toDateString();
      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = {
          date: item.date,
          minTemp: item.minTemp,
          maxTemp: item.maxTemp,
          humidity: item.humidity,
          pressure: item.pressure,
          windSpeed: item.windSpeed,
          description: item.description,
          icon: item.icon,
          precipitation: item.precipitation,
          hourly: []
        };
      }
      dailyForecast[dateKey].hourly.push(item);
    });

    return Object.values(dailyForecast);
  }

  // Get agricultural weather recommendations
  getAgriculturalRecommendations(weatherData) {
    const recommendations = [];
    const { temperature, humidity, windSpeed, precipitation } = weatherData;

    // Temperature recommendations
    if (temperature > 35) {
      recommendations.push({
        type: 'irrigation',
        priority: 'high',
        message: 'High temperature detected. Increase irrigation frequency.',
        action: 'Water crops early morning or late evening'
      });
    } else if (temperature < 10) {
      recommendations.push({
        type: 'protection',
        priority: 'high',
        message: 'Low temperature detected. Protect crops from frost.',
        action: 'Cover crops or use frost protection methods'
      });
    }

    // Humidity recommendations
    if (humidity > 80) {
      recommendations.push({
        type: 'disease_prevention',
        priority: 'medium',
        message: 'High humidity detected. Monitor for fungal diseases.',
        action: 'Apply fungicide if necessary and improve air circulation'
      });
    } else if (humidity < 30) {
      recommendations.push({
        type: 'irrigation',
        priority: 'medium',
        message: 'Low humidity detected. Consider irrigation.',
        action: 'Water crops to maintain soil moisture'
      });
    }

    // Wind recommendations
    if (windSpeed > 15) {
      recommendations.push({
        type: 'protection',
        priority: 'medium',
        message: 'Strong winds detected. Protect young plants.',
        action: 'Use windbreaks or cover young plants'
      });
    }

    // Precipitation recommendations
    if (precipitation > 10) {
      recommendations.push({
        type: 'drainage',
        priority: 'high',
        message: 'Heavy rainfall expected. Check drainage systems.',
        action: 'Ensure proper drainage to prevent waterlogging'
      });
    }

    return recommendations;
  }

  // Get weather alerts
  getWeatherAlerts(weatherData) {
    const alerts = [];
    const { temperature, humidity, windSpeed, precipitation } = weatherData;

    // Extreme temperature alerts
    if (temperature > 40) {
      alerts.push({
        type: 'extreme_heat',
        severity: 'critical',
        message: 'Extreme heat warning',
        description: 'Temperatures are dangerously high for crops'
      });
    } else if (temperature < 0) {
      alerts.push({
        type: 'frost',
        severity: 'critical',
        message: 'Frost warning',
        description: 'Risk of frost damage to crops'
      });
    }

    // High humidity alerts
    if (humidity > 90) {
      alerts.push({
        type: 'high_humidity',
        severity: 'warning',
        message: 'High humidity warning',
        description: 'Increased risk of fungal diseases'
      });
    }

    // Strong wind alerts
    if (windSpeed > 25) {
      alerts.push({
        type: 'strong_winds',
        severity: 'warning',
        message: 'Strong wind warning',
        description: 'Risk of crop damage from strong winds'
      });
    }

    // Heavy rain alerts
    if (precipitation > 20) {
      alerts.push({
        type: 'heavy_rain',
        severity: 'warning',
        message: 'Heavy rainfall warning',
        description: 'Risk of flooding and waterlogging'
      });
    }

    return alerts;
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Mock data for development/testing
  getMockWeatherData() {
    return {
      temperature: 25 + Math.random() * 10,
      feelsLike: 25 + Math.random() * 10,
      humidity: 40 + Math.random() * 40,
      pressure: 1013 + Math.random() * 20,
      windSpeed: Math.random() * 15,
      windDirection: Math.random() * 360,
      visibility: 10,
      uvIndex: Math.random() * 10,
      description: 'Partly cloudy',
      icon: '02d',
      sunrise: new Date(),
      sunset: new Date(),
      timestamp: new Date(),
      location: {
        name: 'Kampala',
        country: 'UG',
        latitude: 0.3476,
        longitude: 32.5825
      }
    };
  }

  getMockForecastData(days) {
    const forecast = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date,
        minTemp: 20 + Math.random() * 10,
        maxTemp: 25 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        pressure: 1013 + Math.random() * 20,
        windSpeed: Math.random() * 15,
        description: 'Partly cloudy',
        icon: '02d',
        precipitation: Math.random() * 5,
        hourly: []
      });
    }
    return forecast;
  }

  // Save weather data to local storage
  async saveWeatherData(weatherData) {
    try {
      const timestamp = new Date().toISOString();
      const dataPoint = {
        ...weatherData,
        timestamp,
        id: Date.now().toString()
      };

      const savedData = await AsyncStorage.getItem('weatherData');
      const weatherHistory = savedData ? JSON.parse(savedData) : [];
      
      weatherHistory.push(dataPoint);
      
      // Keep only last 100 data points
      if (weatherHistory.length > 100) {
        weatherHistory.splice(0, weatherHistory.length - 100);
      }
      
      await AsyncStorage.setItem('weatherData', JSON.stringify(weatherHistory));
      return true;
    } catch (error) {
      console.error('Error saving weather data:', error);
      return false;
    }
  }

  // Get weather data history
  async getWeatherDataHistory(limit = 50) {
    try {
      const savedData = await AsyncStorage.getItem('weatherData');
      const weatherHistory = savedData ? JSON.parse(savedData) : [];
      
      return weatherHistory.slice(-limit);
    } catch (error) {
      console.error('Error getting weather data history:', error);
      return [];
    }
  }
}

export default new WeatherService();
