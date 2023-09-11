import React from "react";
import { convertTemperature } from "../Reusables/Weather";
import { WeatherDataLabel } from "../Reusables/Button";
import "../App.css";

const Top5CitiesWeather = (props) => {
  // Getting Top5CitiesWeather from WeatherDashboardWithAllProps
  const top5CitiesWeather = props.top5CitiesWeather;
  if (!top5CitiesWeather) {
    return <div>Loading...</div>;
  }

  // Getting units from WeatherDashboardWithAllProps
  const { units } = props;

  return (
    <>
      <div className="cities_div_container mt-4">
        <h5 className="mt-2" style={{ fontWeight: 700, color: "#0D9BE5" }}>
          Forecast in Top 5 Near by Cities for you{" "}
          <i
            className="fa fa-arrow-right"
            style={{ fontSize: "14px" }}
            aria-hidden="true"
          ></i>
        </h5>
        <div className="cities_div_wrapper">
          {top5CitiesWeather &&
            top5CitiesWeather.map((city, i) => {
              return (
                <div className="cities_div dark_mode_smaller_div" key={i}>
                  <WeatherDataLabel
                    dataTitle="data-nearest-city"
                    classNames="label mb-0"
                    buttonInnerText={city.name}
                  />
                  <WeatherDataLabel
                    buttonInnerText={`Country: ${city.sys.country}`}
                  />
                  <WeatherDataLabel
                    dataTitle="data-nearest-city-current-temperature"
                    classNames="label mb-0"
                    style={{ fontSize: "12px" }}
                    buttonInnerText={
                      units === "C"
                        ? ` ${city.main.temp} °C`
                        : ` ${
                            convertTemperature(city.main.temp).tempInFahrenheit
                          } °F`
                    }
                  />
                  <img
                    src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                    alt="Nearest City"
                    width="40px"
                    height="40px"
                    data-nearest-city-image-url
                  />
                  <WeatherDataLabel
                    dataTitle="data-nearest-city-weather-type"
                    classNames="label mb-0"
                    style={{ fontSize: "12px" }}
                    buttonInnerText={`${city.weather[0].main} - ${city.weather[0].description}`}
                  />
                  <WeatherDataLabel
                    dataTitle="data-nearest-city-max-temp"
                    classNames="label mb-0"
                    style={{ fontSize: "12px" }}
                    buttonInnerText={
                      units === "C"
                        ? `H: ${city.main.temp_max} °C`
                        : `H: ${
                            convertTemperature(city.main.temp).tempInFahrenheit
                          } °F`
                    }
                  />
                  <WeatherDataLabel
                    dataTitle="data-nearest-city-min-temp"
                    classNames="label mb-0"
                    style={{ fontSize: "12px" }}
                    buttonInnerText={
                      units === "C"
                        ? `L: ${city.main.temp_min} °C`
                        : `L: ${
                            convertTemperature(city.main.temp_min)
                              .tempInFahrenheit
                          } °F`
                    }
                  />
                  <WeatherDataLabel
                    dataTitle="data-nearest-city-feels-like-temperature"
                    classNames="label mb-0"
                    style={{ fontSize: "12px" }}
                    buttonInnerText={
                      units === "C"
                        ? `Feels Like: ${city.main.feels_like} °C`
                        : `Feels Like: ${
                            convertTemperature(city.main.feels_like)
                              .tempInFahrenheit
                          } °F`
                    }
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Top5CitiesWeather;
