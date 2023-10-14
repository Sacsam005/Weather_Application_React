import React from "react";
import { convertTemperature } from "../Reusables/Weather";
import { WeatherDataLabel } from "../Reusables/Button";
import "../App.css";

const ThreeHourlyWeatherForecast = (props) => {
  // Getting randomCity from WeatherDashboardWithAllProps
  const randomCity = props.randomCity;
  if (!randomCity) {
    return <div>Loading...</div>;
  }

  // Getting units from WeatherDashboardWithAllProps
  const { units } = props;

  const now = new Date();
  const cityWeatherDataLists = randomCity.list;
  return (
    <>
      <div className="hourly_updated_weather_container">
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
        <div className="hourly_updated_weather_div_wrapper">
          {cityWeatherDataLists &&
            cityWeatherDataLists.map((list, i) => {
              const weatherDataLists = cityWeatherDataLists[i];
              const time = weatherDataLists.dt_txt;
              const forecastTime = new Date(time);
              const diffInDays = Math.floor(
                (forecastTime.getTime(time) - now.getTime(time)) /
                  (1000 * 60 * 60 * 24)
              );
              let forecastTimeLabel = forecastTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
              let timeInterval;
              if (diffInDays === 0) {
                timeInterval = `Today ${forecastTimeLabel}`;
              } else if (diffInDays === 1) {
                timeInterval = `Tomorrow ${forecastTimeLabel}`;
              } else {
                const daysOfWeek = [
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ];
                const dayOfWeek = daysOfWeek[forecastTime.getDay()];
                timeInterval = `${dayOfWeek} ${forecastTimeLabel}`;
              }
              if (forecastTime > now) {
                return (
                  <div
                    className="weather_update_div dark_mode_smaller_div"
                    key={i}
                  >
                    <WeatherDataLabel
                      dataTitle="data-hourly-update-weather-time"
                      classNames="weather_time"
                      style={{ fontWeight: 500 }}
                      buttonInnerText={timeInterval}
                    />
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherDataLists.weather[0].icon}@2x.png`}
                      alt="Weather Type"
                      className="weather_image m-auto"
                      width="40px"
                      height="40px"
                    />
                    <WeatherDataLabel
                      dataTitle="data-hourly-update-temp-main"
                      classNames="weather_update_temperature_main"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                      buttonInnerText={
                        units === "C"
                          ? `${list.main.temp} °C`
                          : `${
                              convertTemperature(list.main.temp)
                                .tempInFahrenheit
                            } °F`
                      }
                    />
                    <div className="min_max_temperature_container d-flex justify-content-between align-items-center mt-2">
                      <WeatherDataLabel
                        dataTitle="data-hourly-update-temp-max"
                        classNames="weather_update_temperature_max label mb-0"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        buttonInnerText={
                          units === "C"
                            ? `H: ${list.main.temp_max} °C`
                            : `H: ${
                                convertTemperature(list.main.temp_max)
                                  .tempInFahrenheit
                              } °F`
                        }
                      />
                      <WeatherDataLabel
                        dataTitle="data-hourly-update-temp-min"
                        classNames="weather_update_temperature_min label mb-0"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        buttonInnerText={
                          units === "C"
                            ? `L: ${list.main.temp_min} °C`
                            : `L: ${
                                convertTemperature(list.main.temp_min)
                                  .tempInFahrenheit
                              } °F`
                        }
                      />
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default ThreeHourlyWeatherForecast;
