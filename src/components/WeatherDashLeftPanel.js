import React from "react";
import Top5CitiesWeather from "./Top5CitiesWeather";
import Button, { WeatherDataLabel } from "../Reusables/Button";
import { convertTemperature } from "../Reusables/Weather";

const WeatherDashLeftPanel = (props) => {
  const {
    isDarkMode,
    setIsDarkMode,
    units,
    handleUnitChange,
    isMetricActive,
    cityInputTerm,
    setCityInputTerm,
    randomCity,
    top5CitiesWeather,
    currentTime,
    getWeatherData,
  } = props;

  return (
    <>
      <div className="weather_container_left_panel">
        <div className="weather_container_top_section d-block">
          <div className="weather_title_div">
            <h1 style={{ fontWeight: 900 }}>Weather Dashboard</h1>
            <Button
              classNames="dark_mode_button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              buttonInnerText={isDarkMode ? "Light Mode" : "Dark Mode"}
            />
          </div>
          <div className="weather_props_units_button_div">
            <Button
              classNames="metrics_unit_button"
              style={{ opacity: `${isMetricActive ? "0.5" : "1"}` }}
              onClick={() => handleUnitChange("C")}
              buttonInnerText="Metric"
            />
            <Button
              classNames="imperial_unit_button"
              style={{ opacity: `${isMetricActive ? "1" : "0.5"}` }}
              onClick={() => handleUnitChange("F")}
              buttonInnerText="Imperial"
            />
          </div>
        </div>
        <div className="weather_container_time_and_input_div my-2">
          <WeatherDataLabel
            dataTitle="data-time-stamp"
            style={{ fontWeight: 900, display: "block" }}
            buttonInnerText={currentTime}
          />
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
          <WeatherDataLabel
            dataTitle="data-city"
            style={{ fontSize: "1.75rem", fontWeight: 900 }}
            buttonInnerText={randomCity.city.name}
          />
          <WeatherDataLabel
            dataTitle="data-country"
            classNames="label"
            buttonInnerText={`Country: ${randomCity.city.country}`}
          />
        </div>
        <div className="weather_temperature_data_div">
          <WeatherDataLabel
            dataTitle="data-current-temperature"
            classNames="label"
            style={{ fontSize: "3rem", fontWeight: 900 }}
            buttonInnerText={
              units === "C"
                ? `${randomCity.list[0].main.temp} °C`
                : `${
                    convertTemperature(randomCity.list[0].main.temp)
                      .tempInFahrenheit
                  }
                °F`
            }
          />
          <img
            src={`https://openweathermap.org/img/wn/${randomCity.list[0].weather[0].icon}@2x.png`}
            alt="Weather"
            width="100px"
            height="100px"
            data-image-url
          />
          <WeatherDataLabel
            dataTitle="data-weather-type"
            classNames="label mb-1"
            style={{ fontWeight: 700 }}
            buttonInnerText={`${randomCity.list[0].weather[0].main} - ${randomCity.list[0].weather[0].description}`}
          />
          <WeatherDataLabel
            dataTitle="data-max-temp"
            classNames="label mb-0"
            buttonInnerText={
              units === "C"
                ? `Max: ${randomCity.list[0].main.temp_max} °C`
                : `Max: ${
                    convertTemperature(randomCity.list[0].main.temp_max)
                      .tempInFahrenheit
                  }
                °F`
            }
          />
          <WeatherDataLabel
            dataTitle="data-min-temp"
            classNames="label mb-0"
            buttonInnerText={
              units === "C"
                ? `Min: ${randomCity.list[0].main.temp_min} °C`
                : `Min: ${
                    convertTemperature(randomCity.list[0].main.temp_min)
                      .tempInFahrenheit
                  }
                °F`
            }
          />
          <WeatherDataLabel
            dataTitle="data-feels-like-temperature"
            classNames="label mb-0 mt-1"
            style={{ fontSize: "1.3rem" }}
            buttonInnerText={
              units === "C"
                ? `Feels Like: ${randomCity.list[0].main.feels_like}
                °C`
                : `Feels Like: ${
                    convertTemperature(randomCity.list[0].main.feels_like)
                      .tempInFahrenheit
                  }
                °F`
            }
          />
        </div>

        {/* Top 5 near by cities component */}
        <Top5CitiesWeather
          top5CitiesWeather={top5CitiesWeather}
          units={units}
        />
        {/* END of Top 5 near by cities component */}
      </div>
    </>
  );
};

export default WeatherDashLeftPanel;
