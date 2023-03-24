import React from "react";
import "../App.css";
import { convertTemperature } from "./WeatherClass";

const WeatherForecast = (props) => {
  // Getting citiesData from WeatherDashboardWithAllProps
  const citiesData = props.citiesData;
  if (!citiesData) {
    return <div>Loading...</div>;
  }

  // Getting units from WeatherDashboardWithAllProps
  const { units } = props;

  const now = new Date();
  const arrayDataLists = citiesData.list;
  return (
    <>
      {arrayDataLists &&
        arrayDataLists.map((list, i) => {
          const lists = arrayDataLists[i];
          const time = lists.dt_txt;
          const forecastTime = new Date(time);
          const diffInDays = Math.floor(
            (forecastTime.getTime(time) - now.getTime(time)) /
              (1000 * 60 * 60 * 24)
          );
          let forecastTimeLabelDisplay = forecastTime.toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          let timeInterval;
          if (diffInDays === 0) {
            timeInterval = `Today ${forecastTimeLabelDisplay}`;
          } else if (diffInDays === 1) {
            timeInterval = `Tomorrow ${forecastTimeLabelDisplay}`;
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
            timeInterval = `${dayOfWeek} ${forecastTimeLabelDisplay}`;
          }
          if (forecastTime > now) {
            return (
              <div className="weather_update_div dark_mode_smaller_div" key={i}>
                <h6 className="weather_time">{timeInterval}</h6>
                <img
                  src={`https://openweathermap.org/img/wn/${lists.weather[0].icon}@2x.png`}
                  alt="Weather Type"
                  className="weather_image m-auto"
                  width="40px"
                  height="40px"
                />
                <h6
                  data-hourly-update-temp-main
                  className="weather_temperature"
                >
                  {units === "C"
                    ? `${list.main.temp} °C`
                    : `${
                        convertTemperature(list.main.temp).tempInFahrenheit
                      } °F`}
                </h6>
                <div className="min_max_temperature_container d-flex justify-content-between align-items-center mt-2">
                  <p
                    data-hourly-update-temp-max
                    className="label mb-0"
                    style={{ fontSize: "12px" }}
                  >
                    H:{" "}
                    {units === "C"
                      ? `${list.main.temp_max} °C`
                      : `${
                          convertTemperature(list.main.temp_max)
                            .tempInFahrenheit
                        } °F`}
                  </p>
                  <p
                    data-hourly-update-temp-min
                    className="label mb-0"
                    style={{ fontSize: "12px" }}
                  >
                    L:{" "}
                    {units === "C"
                      ? `${list.main.temp_min} °C`
                      : `${
                          convertTemperature(list.main.temp_min)
                            .tempInFahrenheit
                        } °F`}
                  </p>
                </div>
              </div>
            );
          }
        })}
    </>
  );
};

export default WeatherForecast;
