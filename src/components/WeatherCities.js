import React from "react";
import "../App.css";
import { convertTemperature } from "./WeatherClass";

const Top5NearByCities = (props) => {
  // Getting top5CitiesData from WeatherDashboardWithAllProps
  const top5CitiesData = props.top5CitiesData;
  if (!top5CitiesData) {
    return <div>Loading...</div>;
  }

  // Getting units from WeatherDashboardWithAllProps
  const { units } = props;

  return (
    <>
      {top5CitiesData &&
        top5CitiesData.map((city, i) => {
          return (
            <div className="cities_div dark_mode_smaller_div" key={i}>
              <p data-nearest-city className="label mb-0">
                {city.name}
              </p>
              <span>Country: {city.sys.country}</span>
              <p
                data-nearest-city-current-temperature
                className="label mb-0"
                style={{ fontSize: "12px" }}
              >
                {units === "C"
                  ? ` ${city.main.temp} °C`
                  : ` ${
                      convertTemperature(city.main.temp).tempInFahrenheit
                    } °F`}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                alt="Nearest City"
                width="40px"
                height="40px"
                data-nearest-city-image-url
              />
              <p
                data-nearest-city-weather-type
                className="label mb-0"
                style={{ fontSize: "12px" }}
              >
                {city.weather[0].main} - {city.weather[0].description}
              </p>
              <p
                data-nearest-city-max-temp
                className="label mb-0"
                style={{ fontSize: "12px" }}
              >
                H:
                {units === "C"
                  ? ` ${city.main.temp_max} °C`
                  : ` ${
                      convertTemperature(city.main.temp).tempInFahrenheit
                    } °F`}
              </p>
              <p
                data-nearest-city-min-temp
                className="label mb-0"
                style={{ fontSize: "12px" }}
              >
                L:
                {units === "C"
                  ? ` ${city.main.temp_min} °C`
                  : ` ${
                      convertTemperature(city.main.temp_min).tempInFahrenheit
                    } °F`}
              </p>
              <p
                data-nearest-city-feels-like-temperature
                className="label mt-0"
              >
                Feels Like:
                {units === "C"
                  ? ` ${city.main.feels_like} °C`
                  : ` ${
                      convertTemperature(city.main.feels_like).tempInFahrenheit
                    } °F`}
              </p>
            </div>
          );
        })}
    </>
  );
};

export default Top5NearByCities;
