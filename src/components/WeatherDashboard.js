import React, { useState, useEffect } from "react";
import WeatherDashLeftPanel from "./WeatherDashLeftPanel";
import WeatherDashRightPanel from "./WeatherDashRightPanel";
import {
  calculateWeatherMetrics,
  getLabelsColorChanged,
  calculateAirQualityIndex,
} from "../Reusables/Weather";
import "../App.css";

const WeatherDashboardWithAllProps = (props) => {
  const [cityInputTerm, setCityInputTerm] = useState("");
  const [randomCity, setRandomCity] = useState(null);
  const [top5CitiesWeather, setTop5CitiesWeather] = useState(null);
  const [windDirection, setWindDirection] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [sunsetTime, setSunsetTime] = useState(null);
  const [sunriseTime, setSunriseTime] = useState(null);
  const [cloudiness, setCloudiness] = useState(null);
  const [dewPoint, setDewPoint] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [airQualityIndex, setAirQualityIndex] = useState(null);
  const [heatIndex, setHeatIndex] = useState(null);
  const [isMetricActive, setIsMetricActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Passing dark mode state object as props
  const { isDarkMode, setIsDarkMode } = props;

  // Toggle units on click
  const [units, switchUnits] = useState("C");
  const handleUnitChange = (units) => {
    switchUnits(units);
    switchUnits(units);
    if (units === "C") {
      setIsMetricActive(true);
    } else {
      setIsMetricActive(false);
    }
  };

  // -----------------------------------------------
  // Some basic encapsulation for ciphering...
  function getSecretToken(randomToken) {
    let tokenWithoutRandomKey = randomToken.replace("random", "");
    let token = tokenWithoutRandomKey.split("").reverse().join("");
    return token;
  }

  const cipherCode1 = getSecretToken("e7b5random03d3");
  const cipherCode2 = getSecretToken("4b8frandomb78e");
  const cipherCode3 = getSecretToken("9413random053c");
  const cipherCode4 = getSecretToken("c1carandomb056");

  let cipher;

  function sum(arg1, arg2, arg3, arg4) {
    return (cipher = arg1 + arg2 + arg3 + arg4);
  }

  sum(cipherCode1, cipherCode2, cipherCode3, cipherCode4);

  let apiUrl = "";
  let unit = "metric";
  async function getWeatherData(cityInput, zipCode) {
    if (cityInput) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&limit=5&appid=${cipher}&units=${unit}`;
      if (cityInput === "404" || cityInput === "undefined") {
        alert("Sorry, the city you entered could not be found :(");
      }
    } else if (zipCode) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${cipher}`;
    } else {
      // Getting initial random city
      const randomCitiesListResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/find?lat=32.7&lon=-96.8&cnt=10&appid=${cipher}`
      );
      const randomCities = await randomCitiesListResponse.json();
      const randomCity =
        randomCities.list[Math.floor(Math.random() * randomCities.list.length)];
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${randomCity.id}&appid=${cipher}&units=${unit}`;
    }

    try {
      const response = await fetch(`${apiUrl}`);
      const data = await response.json();
      if (data.cod === "404") {
        alert("Sorry, the city you entered could not be found :(");
        return;
      }
      setIsLoading(false);
      setRandomCity(data);

      // Instance of calculateWeatherMetrics with weather factors data
      let weatherMetrics = new calculateWeatherMetrics(
        data.list[0].visibility,
        data.list[0].main.temp,
        data.list[0].main.humidity,
        data.list[0].wind.deg,
        data.list[0].clouds.all
      );

      // Setting wind direction
      const windDirection = weatherMetrics.getWindDirection();
      setWindDirection(windDirection);

      // Setting visibility
      const visibility = weatherMetrics.getVisibility();
      setVisibility(visibility);

      // Setting formatted sunrise, sunset and current time
      const sunriseTimestamp = data.city.sunrise;
      const sunsetTimestamp = data.city.sunset;
      const currentTimeStamp = weatherMetrics.getTime(new Date());
      const sunriseTime = weatherMetrics.getTime(
        new Date(sunriseTimestamp * 1000)
      );
      const sunsetTime = weatherMetrics.getTime(
        new Date(sunsetTimestamp * 1000)
      );

      setSunriseTime(sunriseTime.formattedTimeOnly);
      setSunsetTime(sunsetTime.formattedTimeOnly);
      setCurrentTime(currentTimeStamp.currentDayAndTime);

      // Setting cloudiness
      const cloudiness = weatherMetrics.getCloudiness();
      setCloudiness(cloudiness);

      // Setting dew point
      const dewPoint = weatherMetrics.getDewPoint();
      setDewPoint(dewPoint);

      // Setting pressure
      let pressureTextLabel;
      let pressureInHg = `${(
        data.list[0].main.pressure * 0.0295299830714
      ).toFixed(2)} inHg.`;
      pressureInHg >= 30 && pressureInHg <= 31
        ? (pressureTextLabel = "The current pressure is around the average.")
        : pressureInHg > 31
        ? (pressureTextLabel = "Conditions are favorable for high pressure.")
        : (pressureTextLabel = "Conditions are favorable for low pressure.");
      const pressureData = {
        pressureInHg: pressureInHg,
        pressureTextLabel: pressureTextLabel,
      };
      setPressure(pressureData);

      // Setting heat index
      const heatIndexTemp = weatherMetrics.getHeatIndex(
        data.list[0].main.temp,
        data.list[0].main.humidity
      );
      setHeatIndex(heatIndexTemp);

      // Fetching 5 nearby cities around the city searched by the user
      async function getNearByCities() {
        const lat = data.city.coord.lat;
        const lon = data.city.coord.lon;
        try {
          const nearbyCitiesApiUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${cipher}&units=${unit}`;
          const response = await fetch(nearbyCitiesApiUrl);
          const dataToGetCities = await response.json();
          const nearbyCities = dataToGetCities.list;
          setTop5CitiesWeather(nearbyCities);
        } catch (error) {
          console.log("Error", error);
        }
      }

      // Fetching data from Air Pollution API
      async function getAirPollutionData() {
        try {
          const lat = data.city.coord.lat;
          const lon = data.city.coord.lon;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&cnt=5&appid=${cipher}`
          );
          const dataFromAirPollutionAPI = await response.json();

          // Setting weather air quality index information
          const { aqiName, aqiError } = calculateAirQualityIndex(
            dataFromAirPollutionAPI.list[0].components.so2,
            dataFromAirPollutionAPI.list[0].components.no2,
            dataFromAirPollutionAPI.list[0].components.pm10,
            dataFromAirPollutionAPI.list[0].components.pm2_5,
            dataFromAirPollutionAPI.list[0].components.o3,
            dataFromAirPollutionAPI.list[0].components.co
          );
          const airQualityIndex = {
            aqiName,
            aqiError,
          };
          setAirQualityIndex(airQualityIndex);
        } catch (error) {
          console.log("Error", error);
        }
      }
      getAirPollutionData();
      getNearByCities();
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    getWeatherData(cityInputTerm);
    getLabelsColorChanged();
    /* eslint-disable */
  }, []);
  // -----------------------------------------------

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <p>Loading...</p>
        </div>
      ) : (
        randomCity && (
          <div
            className={`weather_information_container ${
              isDarkMode ? "dark_mode" : "light_mode"
            }`}
          >
            <WeatherDashLeftPanel
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              units={units}
              handleUnitChange={handleUnitChange}
              isMetricActive={isMetricActive}
              cityInputTerm={cityInputTerm}
              setCityInputTerm={setCityInputTerm}
              randomCity={randomCity}
              top5CitiesWeather={top5CitiesWeather}
              currentTime={currentTime}
              getWeatherData={getWeatherData}
            />

            <WeatherDashRightPanel
              units={units}
              randomCity={randomCity}
              windDirection={windDirection}
              visibility={visibility}
              sunriseTime={sunriseTime}
              sunsetTime={sunsetTime}
              cloudiness={cloudiness}
              dewPoint={dewPoint}
              pressure={pressure}
              airQualityIndex={airQualityIndex}
              heatIndex={heatIndex}
            />
          </div>
        )
      )}
    </>
  );
};

export default WeatherDashboardWithAllProps;
