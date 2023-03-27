import React from "react";
import ThreeHourlyWeatherForecast from "./3-HourlyForecast";
import WeatherPropertiesDiv from "../Reusable Components/WeatherPropertiesDiv";
import { convertTemperature, convertSpeed } from "./Class";

const WeatherDashRightPanel = (props) => {
  const {
    units,
    citiesData,
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
        <ThreeHourlyWeatherForecast citiesData={citiesData} units={units} />
        {/* END of weather forecast */}

        <div className="weather_dynamic_props_div_wrapper mt-4">
          <div className="weather_dynamic_props_div">
            <div className="row mt-2">
              <WeatherPropertiesDiv
                classNames="weather_humidity weather_props_column p-2"
                title="Humidity"
                dataTitle="data-humidity"
                weatherPropData={`${citiesData.list[0].main.humidity}%.`}
                weatherPropText={`
                      ${
                        citiesData.list[0].main.humidity < 20
                          ? "Almost no chance of rain today."
                          : citiesData.list[0].main.humidity > 20 &&
                            citiesData.list[0].main.humidity < 50
                          ? "Even chances of rain today."
                          : citiesData.list[0].main.humidity > 50 &&
                            citiesData.list[0].main.humidity < 70
                          ? "Slight chances of rain today."
                          : "It's going to rain today."
                      }`}
                src={require("../../img/humidity.png")}
                altText="Humidity"
              />
              <WeatherPropertiesDiv
                classNames="weather_wind_speed weather_props_column p-2"
                title="Wind Speed"
                dataTitle="data-wind-speed"
                weatherPropData={
                  units === "C"
                    ? convertSpeed(citiesData.list[0].wind.speed)
                        .speedInKilometers
                    : convertSpeed(citiesData.list[0].wind.speed).speedInMiles
                }
                src={require("../../img/wind_speed.png")}
                altText="Wind Speed"
              />
              <WeatherPropertiesDiv
                classNames="weather_wind_direction weather_props_column p-2"
                title="Wind Direction"
                dataTitle="data-wind-direction"
                weatherPropData={windDirection}
                src={require("../../img/wind_direction.png")}
                altText="Wind Direction"
              />
              {visibility && (
                <WeatherPropertiesDiv
                  classNames="weather_visibility weather_props_column p-2"
                  title="Visibility"
                  dataTitle="data-visibility"
                  weatherPropData={
                    units === "C"
                      ? visibility.visibilityInKilometers
                      : visibility.visibilityInMiles
                  }
                  weatherPropText={visibility.visibilityTextLabel}
                  src={require("../../img/visibility.png")}
                  altText="Visibility"
                  style={{ fontSize: "12px" }}
                />
              )}
              <WeatherPropertiesDiv
                classNames="weather_sunrise weather_props_column p-2"
                title="Sunrise"
                dataTitle="data-sunrise"
                weatherPropData={sunriseTime}
                src={require("../../img/sunrise.png")}
                altText="Sunrise"
              />
              <WeatherPropertiesDiv
                classNames="weather_sunset weather_props_column p-2"
                title="Sunset"
                dataTitle="data-sunset"
                weatherPropData={sunsetTime}
                src={require("../../img/sunset.png")}
                altText="Sunset"
              />
              {cloudiness && (
                <WeatherPropertiesDiv
                  classNames="weather_cloudiness weather_props_column p-2"
                  title="Cloudiness"
                  dataTitle="data-cloudiness"
                  weatherPropData={cloudiness.cloudiness}
                  weatherPropText={cloudiness.cloudinessTextLabel}
                  src={require("../../img/cloudiness.png")}
                  altText="Cloudiness"
                />
              )}
              <WeatherPropertiesDiv
                classNames="weather_dew_point weather_props_column p-2"
                title="Dew Point"
                dataTitle="data-cloudiness"
                weatherPropData={
                  units === "C"
                    ? `${dewPoint} °C Td.`
                    : `${convertTemperature(dewPoint).tempInFahrenheit} °F Td.`
                }
                src={require("../../img/dew_point.png")}
                altText="Dew Point"
              />
              {pressure && (
                <WeatherPropertiesDiv
                  classNames="weather_pressure weather_props_column p-2"
                  title="Pressure"
                  dataTitle="data-pressure"
                  weatherPropData={pressure.pressureInHg}
                  weatherPropText={pressure.pressureTextLabel}
                  src={require("../../img/pressure.png")}
                  altText="Pressure"
                />
              )}
              {airQualityIndex && (
                <WeatherPropertiesDiv
                  classNames="weather_air_quality_index weather_props_column p-2"
                  title="Air Quality Index"
                  dataTitle="data-air-quality-index"
                  weatherPropData={
                    airQualityIndex.aqiName === undefined
                      ? `${airQualityIndex.aqiError} μg/m3`
                      : `${airQualityIndex.aqiName}`
                  }
                  src={require("../../img/aqi_index.png")}
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
                <WeatherPropertiesDiv
                  classNames="weather_heat_index weather_props_column p-2"
                  title="Heat Index"
                  dataTitle="data-heat-index"
                  weatherPropData={
                    heatIndex.heatIndex < 0
                      ? heatIndex.alertText
                      : heatIndex.heatIndex
                  }
                  src={require("../../img/humidity.png")}
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
