import React, { useState, useEffect } from "react";
import "../App.css";
import WeatherForecast from "./WeatherForecast";
import Top5NearByCities from "./WeatherCities";
import {
  calculateWeatherFactors,
  getLabelsColorChanged,
  convertTemperature,
  convertSpeed,
  calculateAirQualityIndex,
} from "./WeatherClass";

const WeatherDashboardWithAllProps = (props) => {
  const [cityInputTerm, setCityInputTerm] = useState("");
  const [citiesData, setCitiesData] = useState(null);
  const [top5CitiesData, setTop5CitiesData] = useState(null);
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
  function getToken(randomToken) {
    let tokenWithoutRandomKey = randomToken.replace("random", "");
    let token = tokenWithoutRandomKey.split("").reverse().join("");
    return token;
  }
  const cipherCode1 = getToken("e7b5random03d3");
  const cipherCode2 = getToken("4b8frandomb78e");
  const cipherCode3 = getToken("9413random053c");
  const cipherCode4 = getToken("c1carandomb056");
  let cipher;
  function sum(arg1, arg2, arg3, arg4) {
    return (cipher = arg1 + arg2 + arg3 + arg4);
  }
  sum(cipherCode1, cipherCode2, cipherCode3, cipherCode4);

  let apiUrl = "";
  let unit = "metric";
  async function getWeatherData(cityInput) {
    if (cityInput) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&limit=5&appid=${cipher}&units=${unit}`;
      if (cityInput === "undefined") {
        alert("Sorry, the city you entered could not be found :(");
      }
    } else {
      // Getting initial random city
      const cityListResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/find?lat=32.7&lon=-96.8&cnt=10&appid=${cipher}`
      );
      const cityListData = await cityListResponse.json();
      const randomCity =
        cityListData.list[Math.floor(Math.random() * cityListData.list.length)];
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${randomCity.id}&appid=${cipher}&units=${unit}`;
    }
    try {
      const response = await fetch(`${apiUrl}`);
      const data = await response.json();
      setIsLoading(false);
      setCitiesData(data);

      // Instance of calculateWeatherFactors with weather factors data
      let weatherFactorsData = new calculateWeatherFactors(
        data.list[0].visibility,
        data.list[0].main.temp,
        data.list[0].main.humidity,
        data.list[0].wind.deg,
        data.list[0].clouds.all
      );

      // Setting wind direction
      const windDirection = weatherFactorsData.getWindDirection();
      setWindDirection(windDirection);

      // Setting visibility
      const visibility = weatherFactorsData.getVisibility();
      setVisibility(visibility);

      // Setting formatted sunrise, sunset and current time
      const sunriseTimestamp = data.city.sunrise;
      const sunsetTimestamp = data.city.sunset;
      const currentTimeStamp = weatherFactorsData.getTime(new Date());
      const sunriseTime = weatherFactorsData.getTime(
        new Date(sunriseTimestamp * 1000)
      );
      const sunsetTime = weatherFactorsData.getTime(
        new Date(sunsetTimestamp * 1000)
      );
      setSunriseTime(sunriseTime.formattedTimeOnly);
      setSunsetTime(sunsetTime.formattedTimeOnly);
      setCurrentTime(currentTimeStamp.currentDayAndTime);

      // Setting cloudiness
      const cloudiness = weatherFactorsData.getCloudiness();
      setCloudiness(cloudiness);

      // Setting dew point
      const dewPoint = weatherFactorsData.getDewPoint();
      setDewPoint(dewPoint);

      // Setting pressure
      let pressureTextLabel;
      let pressureInHg = `${(
        data.list[0].main.pressure * 0.0295299830714
      ).toFixed(2)} inHg`;
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
      const heatIndexData = weatherFactorsData.getHeatIndex();
      setHeatIndex(heatIndexData);

      // Fetching 5 nearby cities around the city searched by the user
      async function getNearByCities() {
        const lat = data.city.coord.lat;
        const lon = data.city.coord.lon;
        try {
          const nearbyCitiesApiUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${cipher}&units=${unit}`;
          const response = await fetch(nearbyCitiesApiUrl);
          const dataToGetCities = await response.json();
          const nearbyCities = dataToGetCities.list;
          setTop5CitiesData(nearbyCities);
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
          const { aqiName: aqiName, aqiError: aqiError } =
            calculateAirQualityIndex(
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
  }, []);
  // -----------------------------------------------

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <p>Loading...</p>
        </div>
      ) : (
        citiesData && (
          <div
            className={`weather_information_container ${
              isDarkMode ? "dark_mode" : "light_mode"
            }`}
          >
            <div className="weather_container_left_panel p-2">
              <div className="weather_container_top_section d-block">
                <div className="weather_title_div">
                  <h1 style={{ fontWeight: 900 }}>Weather Dashboard</h1>
                  <button
                    className="dark_mode_button border-0 rounded-0 mt-2"
                    style={{
                      boxShadow: "rgba(155, 154, 154, 0.6) 0px 2px 8px 0px",
                      fontWeight: 900,
                    }}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
                <div className="weather_props_units_button_div">
                  <button
                    className="metrics_unit_button border-0 rounded-0 mt-2"
                    style={{
                      boxShadow: "rgba(155, 154, 154, 0.6) 0px 2px 8px 0px",
                      fontWeight: 900,
                      opacity: `${isMetricActive ? "0.5" : "1"}`,
                    }}
                    onClick={() => handleUnitChange("C")}
                  >
                    Metric
                  </button>
                  <button
                    className="imperial_unit_button border-0 rounded-0 mt-2"
                    style={{
                      boxShadow: "rgba(155, 154, 154, 0.6) 0px 2px 8px 0px",
                      fontWeight: 900,
                      opacity: `${isMetricActive ? "1" : "0.5"}`,
                    }}
                    onClick={() => handleUnitChange("F")}
                  >
                    Imperial
                  </button>
                </div>
              </div>
              <div className="weather_container_time_and_input_div my-2">
                <p data-time-stamp style={{ fontWeight: 900, marginBottom: 0 }}>
                  {currentTime}
                </p>
                <input
                  type="text"
                  placeholder="Search for city"
                  value={cityInputTerm}
                  onChange={(e) => setCityInputTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      getWeatherData(cityInputTerm);
                    }
                  }}
                />
              </div>
              <div className="weather_city_and_country_div d-block">
                <h3 data-city>{citiesData.city.name}</h3>
                <p data-country className="label">
                  Country: {citiesData.city.country}
                </p>
              </div>
              <div className="weather_temperature_data_div">
                <h1 data-current-temperature className="label mb-0">
                  {units === "C"
                    ? `${citiesData.list[0].main.temp} °C`
                    : `${
                        convertTemperature(citiesData.list[0].main.temp)
                          .tempInFahrenheit
                      }
                °F`}
                </h1>
                <img
                  src={`https://openweathermap.org/img/wn/${citiesData.list[0].weather[0].icon}@2x.png`}
                  alt="Weather"
                  width="100px"
                  height="100px"
                  data-image-url
                />
                <p
                  data-weather-type
                  className="label mb-1"
                  style={{ fontWeight: 700 }}
                >
                  {citiesData.list[0].weather[0].main}-
                  {citiesData.list[0].weather[0].description}
                </p>
                <p data-max-temp className="label mb-0">
                  Max:{" "}
                  {units === "C"
                    ? `${citiesData.list[0].main.temp_max} °C`
                    : `${
                        convertTemperature(citiesData.list[0].main.temp_max)
                          .tempInFahrenheit
                      }
                °F`}
                </p>
                <p data-min-temp className="label mb-0">
                  Min:{" "}
                  {units === "C"
                    ? `${citiesData.list[0].main.temp_min} °C`
                    : `${
                        convertTemperature(citiesData.list[0].main.temp_min)
                          .tempInFahrenheit
                      }
                °F`}
                </p>
                <p data-feels-like-temperature className="label mb-0">
                  Feels Like:{" "}
                  {units === "C"
                    ? `${citiesData.list[0].main.feels_like}
                °C`
                    : `${
                        convertTemperature(citiesData.list[0].main.feels_like)
                          .tempInFahrenheit
                      }
                °F`}
                </p>
              </div>
              <div className="cities_div_container mt-4">
                <h5
                  className="mt-2"
                  style={{ fontWeight: 700, color: "#0D9BE5" }}
                >
                  Forecast in Top 5 Near by Cities for you{" "}
                  <i
                    className="fa fa-arrow-right"
                    style={{ fontSize: "14px" }}
                    aria-hidden="true"
                  ></i>
                </h5>
                {/* Top 5 near by cities component */}
                <div className="cities_div_wrapper">
                  <Top5NearByCities
                    top5CitiesData={top5CitiesData}
                    units={units}
                  />
                </div>
                {/* END of Top 5 near by cities component */}
              </div>
            </div>

            <div className="weather_container_right_panel p-1">
              <div className="weather_container_bottom_div">
                <div
                  className="hourly_updated_weather_title_div"
                  style={{ color: "#0D9BE5" }}
                >
                  <h6 style={{ fontWeight: 700, marginBottom: "5px" }}>
                    Tomorrow's Forecast
                  </h6>
                  <p className="mb-0">
                    3-hr interval{" "}
                    <i
                      className="fa fa-arrow-right"
                      style={{ fontSize: "14px" }}
                      aria-hidden="true"
                    ></i>
                  </p>
                </div>
                {/* Weather forecast component here */}
                <div className="hourly_updated_weather_div_wrapper">
                  <WeatherForecast citiesData={citiesData} units={units} />
                </div>
                {/* END of weather forecast */}
              </div>
              <div className="weather_dynamic_props_div_wrapper mt-4">
                <div className="weather_dynamic_props_div">
                  <div className="row mt-2">
                    <div
                      className="weather_humidity weather_props_column p-2"
                      title="Humidity"
                    >
                      <h6 data-humidity className="label">
                        Humidity: <br /> {citiesData.list[0].main.humidity}%{" "}
                        <br />
                        {citiesData.list[0].main.humidity < 20 &&
                        citiesData.list[0].main.humidity < 50
                          ? "Almost no chance of rain today."
                          : citiesData.list[0].main.humidity > 50 &&
                            citiesData.list[0].main.humidity < 70
                          ? "Slight chances of rain today."
                          : "It's going to rain today."}
                      </h6>
                      <img
                        src={require("../img/humidity.png")}
                        alt="Humidity"
                      />
                    </div>
                    <div
                      className="weather_wind_speed weather_props_column p-2"
                      title="Wind Speed"
                    >
                      {
                        <>
                          <h6 data-wind-speed className="label">
                            Wind Speed: <br />
                            {units === "C"
                              ? convertSpeed(citiesData.list[0].wind.speed)
                                  .speedInMiles
                              : convertSpeed(citiesData.list[0].wind.speed)
                                  .speedInKilometers}
                          </h6>
                        </>
                      }

                      <img
                        src={require("../img/wind_speed.png")}
                        alt="Wind Speed"
                      />
                    </div>
                    <div
                      className="weather_wind_direction weather_props_column p-2"
                      title="Wind Direction"
                    >
                      <h6 data-wind-direction className="label">
                        Wind Direction:
                        <br /> {windDirection}
                      </h6>
                      <img
                        src={require("../img/wind_direction.png")}
                        alt="Wind Direction"
                      />
                    </div>
                    <div
                      className="weather_visibility weather_props_column p-2"
                      title="Visibility"
                    >
                      <h6
                        data-visibility
                        className="label"
                        style={{ fontSize: "12px" }}
                      >
                        {visibility && (
                          <>
                            <p>
                              Visibility:{" "}
                              {units === "C"
                                ? visibility.visibilityInMiles
                                : visibility.visibilityInKilometers}
                            </p>
                            <span>{visibility.visibilityTextLabel}</span>
                          </>
                        )}
                      </h6>
                      <img
                        src={require("../img/visibility.png")}
                        alt="visibility"
                      />
                    </div>
                    <div
                      className="weather_sunrise weather_props_column p-2"
                      title="Sunrise"
                    >
                      <h6 data-sunrise className="label">
                        Sunrise: <br />
                        {sunriseTime}
                      </h6>
                      <img src={require("../img/sunrise.png")} alt="Sunrise" />
                    </div>
                    <div
                      className="weather_sunset weather_props_column p-2"
                      title="Sunset"
                    >
                      <h6 data-sunset className="label">
                        Sunset:
                        <br /> {sunsetTime}
                      </h6>
                      <img src={require("../img/sunset.png")} alt="Sunset" />
                    </div>
                    <div
                      className="weather_cloudiness weather_props_column p-2"
                      title="Cloudiness"
                    >
                      {cloudiness && (
                        <>
                          <h6 data-cloudiness className="label">
                            {cloudiness.cloudiness} <br />
                            {cloudiness.cloudinessTextLabel}
                          </h6>
                        </>
                      )}
                      <img
                        src={require("../img/cloudiness.png")}
                        alt="Cloudiness"
                      />
                    </div>
                    <div
                      className="weather_dew_point weather_props_column p-2"
                      title="Dew Point"
                    >
                      <h6 data-dew-point className="label">
                        Dew Point:
                        <br />
                        {units === "C"
                          ? `${dewPoint} °C Td`
                          : `${
                              convertTemperature(dewPoint).tempInFahrenheit
                            } °F Td`}
                      </h6>
                      <img
                        src={require("../img/dew_point.png")}
                        alt="Dew Point"
                      />
                    </div>
                    <div
                      className="weather_pressure weather_props_column p-2"
                      title="Pressure"
                    >
                      {pressure && (
                        <>
                          <h6 data-pressure className="label">
                            Pressure: <br />
                            {pressure.pressureInHg} <br />
                            {pressure.pressureTextLabel}
                          </h6>
                        </>
                      )}

                      <img
                        src={require("../img/pressure.png")}
                        alt="Pressure"
                      />
                    </div>
                    <div
                      className="weather_air_quality_index weather_props_column p-2"
                      title="Air Quality Index"
                    >
                      {airQualityIndex && (
                        <>
                          <h6
                            data-air-quality-index
                            className="label"
                            style={{
                              fontSize:
                                airQualityIndex.aqiName === undefined
                                  ? "12px"
                                  : "inherit",
                            }}
                          >
                            Air Quality Index:{" "}
                            {airQualityIndex.aqiName === undefined
                              ? `${airQualityIndex.aqiError} μg/m3`
                              : `Air Quality: ${airQualityIndex.aqiName}`}
                          </h6>
                        </>
                      )}
                      <img
                        src={require("../img/aqi_index.png")}
                        alt="Air Quality Index"
                      />
                    </div>
                    <div
                      className="weather_heat_index weather_props_column p-2"
                      title="Heat Index"
                    >
                      {heatIndex && (
                        <h6 data-heat-index className="label">
                          Heat Index: <br />
                          {heatIndex.heatIndex < 0
                            ? heatIndex.alertText
                            : heatIndex.heatIndex}
                        </h6>
                      )}
                      <img
                        src={require("../img/heat_index.png")}
                        alt="Heat Index"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default WeatherDashboardWithAllProps;
