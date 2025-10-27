/**
 * Real Weather Service - OpenWeatherMap Integration
 * Provides real weather data for Uganda regions
 */

class RealWeatherService {
  constructor() {
    this.apiKey = '671050a07ae15e33755a1dfc1a1465f3';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.ugandaRegions = {
      kampala: { lat: 0.3476, lon: 32.5825, name: 'Kampala' },
      jinja: { lat: 0.4244, lon: 33.2042, name: 'Jinja' },
      masaka: { lat: -0.3356, lon: 31.7342, name: 'Masaka' },
      mbarara: { lat: -0.6097, lon: 30.6489, name: 'Mbarara' },
      gulu: { lat: 2.7796, lon: 32.2992, name: 'Gulu' },
      lira: { lat: 2.2489, lon: 32.8999, name: 'Lira' },
      arua: { lat: 3.0201, lon: 30.9111, name: 'Arua' },
      soroti: { lat: 1.7146, lon: 33.6111, name: 'Soroti' },
      mbale: { lat: 1.0825, lon: 34.1750, name: 'Mbale' },
      fortportal: { lat: 0.6712, lon: 30.2750, name: 'Fort Portal' }
    };
    this.weatherData = new Map();
    this.lastUpdate = null;
    this.updateInterval = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Initialize the weather service
   */
  async initialize() {
    try {
      console.log('🌤️ Initializing Real Weather Service...');
      await this.updateAllWeatherData();
      console.log('✅ Real Weather Service initialized with OpenWeatherMap API');
    } catch (error) {
      console.error('❌ Failed to initialize Real Weather Service:', error);
    }
  }

  /**
   * Get current weather for a specific region
   */
  async getCurrentWeather(region) {
    try {
      const regionData = this.ugandaRegions[region.toLowerCase()];
      if (!regionData) {
        throw new Error(`Region ${region} not found`);
      }

      const url = `${this.baseUrl}/weather?lat=${regionData.lat}&lon=${regionData.lon}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        region: regionData.name,
        temperature: {
          current: Math.round(data.main.temp * 10) / 10,
          feelsLike: Math.round(data.main.feels_like * 10) / 10,
          min: Math.round(data.main.temp_min * 10) / 10,
          max: Math.round(data.main.temp_max * 10) / 10
        },
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: {
          speed: data.wind.speed,
          direction: data.wind.deg,
          gust: data.wind.gust || 0
        },
        visibility: data.visibility / 1000, // Convert to km
        clouds: data.clouds.all,
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        },
        timestamp: new Date(data.dt * 1000).toISOString()
      };
    } catch (error) {
      console.error(`❌ Error getting weather for ${region}:`, error);
      return null;
    }
  }

  /**
   * Update weather data for all regions
   */
  async updateAllWeatherData() {
    try {
      console.log('🔄 Updating weather data for all Uganda regions...');
      
      const promises = Object.keys(this.ugandaRegions).map(async (region) => {
        try {
          const weatherData = await this.getCurrentWeather(region);
          if (weatherData) {
            this.weatherData.set(region, weatherData);
            console.log(`✅ Updated weather for ${weatherData.region}: ${weatherData.temperature.current}°C, ${weatherData.weather.description}`);
          }
        } catch (error) {
          console.error(`❌ Failed to update weather for ${region}:`, error);
        }
      });

      await Promise.all(promises);
      this.lastUpdate = new Date();
      console.log(`✅ Weather data updated for ${this.weatherData.size} regions`);
    } catch (error) {
      console.error('❌ Error updating weather data:', error);
    }
  }

  /**
   * Get weather forecast for a region (5-day forecast)
   */
  async getWeatherForecast(region) {
    try {
      const regionData = this.ugandaRegions[region.toLowerCase()];
      if (!regionData) {
        throw new Error(`Region ${region} not found`);
      }

      const url = `${this.baseUrl}/forecast?lat=${regionData.lat}&lon=${regionData.lon}&appid=${this.apiKey}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process forecast data (3-hour intervals for 5 days)
      const forecast = data.list.map(item => ({
        timestamp: new Date(item.dt * 1000).toISOString(),
        temperature: {
          current: Math.round(item.main.temp * 10) / 10,
          min: Math.round(item.main.temp_min * 10) / 10,
          max: Math.round(item.main.temp_max * 10) / 10
        },
        humidity: item.main.humidity,
        wind: {
          speed: item.wind.speed,
          direction: item.wind.deg
        },
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        rain: item.rain ? item.rain['3h'] || 0 : 0
      }));

      return {
        region: regionData.name,
        forecast: forecast,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Error getting weather forecast for ${region}:`, error);
      return null;
    }
  }

  /**
   * Get all current weather data
   */
  getAllWeatherData() {
    return Array.from(this.weatherData.values());
  }

  /**
   * Get weather data for crop planning
   */
  async getWeatherForCropPlanning(cropId, region = 'kampala') {
    try {
      const weatherData = this.weatherData.get(region.toLowerCase());
      if (!weatherData) {
        await this.updateAllWeatherData();
        return this.weatherData.get(region.toLowerCase());
      }

      // Check if data is stale (older than 30 minutes)
      const now = new Date();
      const dataAge = now - new Date(weatherData.timestamp);
      if (dataAge > this.updateInterval) {
        console.log('🔄 Weather data is stale, updating...');
        await this.updateAllWeatherData();
        return this.weatherData.get(region.toLowerCase());
      }

      return weatherData;
    } catch (error) {
      console.error('❌ Error getting weather for crop planning:', error);
      return null;
    }
  }

  /**
   * Get rainfall data for agricultural planning
   */
  async getRainfallData(region) {
    try {
      const forecast = await this.getWeatherForecast(region);
      if (!forecast) return null;

      // Calculate rainfall over the next 5 days
      const totalRainfall = forecast.forecast.reduce((sum, day) => sum + (day.rain || 0), 0);
      
      return {
        region: forecast.region,
        totalRainfall: Math.round(totalRainfall * 10) / 10,
        dailyRainfall: forecast.forecast.map(day => ({
          date: day.timestamp,
          rainfall: day.rain || 0
        })),
        recommendation: this.getRainfallRecommendation(totalRainfall)
      };
    } catch (error) {
      console.error(`❌ Error getting rainfall data for ${region}:`, error);
      return null;
    }
  }

  /**
   * Get rainfall recommendation for farming
   */
  getRainfallRecommendation(totalRainfall) {
    if (totalRainfall < 5) {
      return 'Low rainfall expected - consider irrigation or drought-resistant crops';
    } else if (totalRainfall < 15) {
      return 'Moderate rainfall expected - good for most crops';
    } else if (totalRainfall < 30) {
      return 'High rainfall expected - monitor for waterlogging';
    } else {
      return 'Very high rainfall expected - consider flood-resistant measures';
    }
  }
}

export default new RealWeatherService();











