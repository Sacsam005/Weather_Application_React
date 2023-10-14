import React from "react";
import ThreeHourlyWeatherForecast from "./3HourlyForecast";
import WeatherProperty from "../Reusables/WeatherProperty";
import { convertTemperature, convertSpeed } from "../Reusables/Weather";

const WeatherDashRightPanel = (props) => {
  const {
    units,
    randomCity,
    windDirection,
    visibility,
    sunriseTime,
    sunsetTime,
    cloudiness,
    dewPoint,
    pressure,
    airQualityIndex,
    heatIndex,
  } = props;
  return (
    <>
      <div className="weather_container_right_panel p-1">
        {/* Weather forecast component here */}
        <ThreeHourlyWeatherForecast randomCity={randomCity} units={units} />
        {/* END of weather forecast */}

        <div className="weather_dynamic_props_div_wrapper mt-4">
          <div className="weather_dynamic_props_div">
            <div className="row mt-2">
              <WeatherProperty
                classNames="weather_humidity weather_props_column p-2"
                title="Humidity"
                dataTitle="data-humidity"
                weatherPropData={`${randomCity.list[0].main.humidity}%.`}
                weatherPropText={`
                      ${
                        randomCity.list[0].main.humidity < 20
                          ? "Almost no chance of rain today."
                          : randomCity.list[0].main.humidity > 20 &&
                            randomCity.list[0].main.humidity < 50
                          ? "Even chances of rain today."
                          : randomCity.list[0].main.humidity > 50 &&
                            randomCity.list[0].main.humidity < 70
                          ? "Slight chances of rain today."
                          : "High chances of rain today."
                      }`}
                src={require("../Img/humidity.png")}
                altText="Humidity"
              />
              <WeatherProperty
                classNames="weather_wind_speed weather_props_column p-2"
                title="Wind Speed"
                dataTitle="data-wind-speed"
                weatherPropData={
                  units === "C"
                    ? convertSpeed(randomCity.list[0].wind.speed)
                        .speedInKilometers
                    : convertSpeed(randomCity.list[0].wind.speed).speedInMiles
                }
                src={require("../Img/wind_speed.png")}
                altText="Wind Speed"
              />
              <WeatherProperty
                classNames="weather_wind_direction weather_props_column p-2"
                title="Wind Direction"
                dataTitle="data-wind-direction"
                weatherPropData={windDirection}
                src={require("../Img/wind_direction.png")}
                altText="Wind Direction"
              />
              {visibility && (
                <WeatherProperty
                  classNames="weather_visibility weather_props_column p-2"
                  title="Visibility"
                  dataTitle="data-visibility"
                  weatherPropData={
                    units === "C"
                      ? visibility.visibilityInKilometers
                      : visibility.visibilityInMiles
                  }
                  weatherPropText={visibility.visibilityTextLabel}
                  src={require("../Img/visibility.png")}
                  altText="Visibility"
                  style={{ fontSize: "12px" }}
                />
              )}
              <WeatherProperty
                classNames="weather_sunrise weather_props_column p-2"
                title="Sunrise"
                dataTitle="data-sunrise"
                weatherPropData={sunriseTime}
                src={require("../Img/sunrise.png")}
                altText="Sunrise"
              />
              <WeatherProperty
                classNames="weather_sunset weather_props_column p-2"
                title="Sunset"
                dataTitle="data-sunset"
                weatherPropData={sunsetTime}
                src={require("../Img/sunset.png")}
                altText="Sunset"
              />
              {cloudiness && (
                <WeatherProperty
                  classNames="weather_cloudiness weather_props_column p-2"
                  title="Cloudiness"
                  dataTitle="data-cloudiness"
                  weatherPropData={cloudiness.cloudiness}
                  weatherPropText={cloudiness.cloudinessTextLabel}
                  src={require("../Img/cloudiness.png")}
                  altText="Cloudiness"
                />
              )}
              <WeatherProperty
                classNames="weather_dew_point weather_props_column p-2"
                title="Dew Point"
                dataTitle="data-cloudiness"
                weatherPropData={
                  units === "C"
                    ? `${dewPoint} °C Td.`
                    : `${convertTemperature(dewPoint).tempInFahrenheit} °F Td.`
                }
                src={require("../Img/dew_point.png")}
                altText="Dew Point"
              />
              {pressure && (
                <WeatherProperty
                  classNames="weather_pressure weather_props_column p-2"
                  title="Pressure"
                  dataTitle="data-pressure"
                  weatherPropData={pressure.pressureInHg}
                  weatherPropText={pressure.pressureTextLabel}
                  src={require("../Img/pressure.png")}
                  altText="Pressure"
                />
              )}
              {airQualityIndex && (
                <WeatherProperty
                  classNames="weather_air_quality_index weather_props_column p-2"
                  title="Air Quality Index"
                  dataTitle="data-air-quality-index"
                  weatherPropData={
                    airQualityIndex.aqiName === undefined
                      ? `${airQualityIndex.aqiError} μg/m3`
                      : `${airQualityIndex.aqiName}`
                  }
                  src={require("../Img/aqi_index.png")}
                  altText="Air Quality Index"
                  style={{
                    fontSize:
                      airQualityIndex.aqiName === undefined
                        ? "12px"
                        : "inherit",
                  }}
                />
              )}
              {heatIndex && (
                <WeatherProperty
                  classNames="weather_heat_index weather_props_column p-2"
                  title="Heat Index Temperature"
                  dataTitle="data-heat-index"
                  weatherPropData={
                    units === "C"
                      ? `${heatIndex.heatIndex} °C. \n ${heatIndex.alertText}`
                      : `${
                          convertTemperature(heatIndex.heatIndex)
                            .tempInFahrenheit
                        } °F. \n ${heatIndex.alertText}`
                  }
                  src={require("../Img/heat_index.png")}
                  altText="Heat Index"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherDashRightPanel;
