/* ------------------------------------------------------------------------ */
// Calculate visibility, dew point, heat index, air quality index...
export class calculateWeatherMetrics {
  constructor(visibility, temperature, humidity, windDegree, cloudiness) {
    this.visibility = visibility;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windDegree = windDegree;
    this.cloudiness = cloudiness;
  }

  getVisibility = () => {
    const amountInKilometers = this.visibility / 1000;
    const amountInMiles = this.visibility / 1000 / 1.609344;
    const visibilityInKilometers = `${parseFloat(amountInKilometers).toFixed(
      2
    )} kms.`;
    const visibilityInMiles = `${parseFloat(amountInMiles).toFixed(2)} mi.`;

    let visibilityTextLabel;
    if (visibilityInMiles < 6 || visibilityInKilometers < 10) {
      visibilityTextLabel =
        "There may be reduced visibility due to atmospheric obstructions.";
    } else {
      visibilityTextLabel =
        "The wind speed is high enough to reduce the impact of atmospheric obstructions on visibility.";
    }
    return { visibilityInKilometers, visibilityInMiles, visibilityTextLabel };
  };

  // Magnus-Tetens approximation, which is widely used to calculate dew point.
  getDewPoint = () => {
    const a = 17.27;
    const b = 237.7;
    const dewPoint =
      (a * this.temperature) / (b + this.temperature) +
      Math.log(this.humidity / 100);
    const dewPointTemperature = ((b * dewPoint) / (a - dewPoint)).toFixed(2);
    return dewPointTemperature;
  };

  getHeatIndex = (temperature, humidity) => {
    const HI = require("heat-index");
    const heatIndex = HI.heatIndex({
      temperature: temperature,
      humidity: humidity,
    });

    let alertText;
    if (heatIndex < 0) {
      alertText = "Temperature is too low to calculate the heat index.";
    } else if (heatIndex < 32) {
      alertText = "No precautions needed.";
    } else if (heatIndex >= 32 && heatIndex < 40) {
      alertText = "Higher temperature than normal. Use caution.";
    } else if (heatIndex >= 40 && heatIndex < 54) {
      alertText = "Higher temperature than normal. Take precautions.";
    } else if (heatIndex >= 54 && heatIndex < 66) {
      alertText = "Higher temperature than normal. Take extra precautions.";
    } else {
      alertText =
        "Higher temperature than normal. Avoid all outdoor activities.";
    }
    return { alertText, heatIndex: heatIndex.toFixed(2) };
  };

  // Wind direction to text words
  getWindDirection = () => {
    const windDirText =
      this.windDegree >= 337.5 || this.windDegree < 22.5
        ? "North"
        : this.windDegree >= 22.5 && this.windDegree < 67.5
        ? "Northeast"
        : this.windDegree >= 67.5 && this.windDegree < 112.5
        ? "East"
        : this.windDegree >= 112.5 && this.windDegree < 157.5
        ? "Southeast"
        : this.windDegree >= 157.5 && this.windDegree < 202.5
        ? "South"
        : this.windDegree >= 202.5 && this.windDegree < 247.5
        ? "Southwest"
        : this.windDegree >= 247.5 && this.windDegree < 292.5
        ? "West"
        : this.windDegree >= 292.5 && this.windDegree < 337.5
        ? "Northwest"
        : "";
    return windDirText;
  };

  // Convert Unix timestamp to JavaScript Date object
  getTime = (time) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const amOrPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTimeOnly = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${amOrPm}`;

    // array of weekday names
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // Getting the current day of the week
    const dayOfWeek = weekdays[time.getDay()];
    const currentDayAndTime = `${dayOfWeek}, ${hours}:${minutes} ${amOrPm} CST`;
    return {
      currentDayAndTime: currentDayAndTime,
      formattedTimeOnly: formattedTimeOnly,
    };
  };

  getCloudiness = () => {
    let cloudiness = this.cloudiness;
    let cloudinessTextLabel;
    if (cloudiness < 20) {
      cloudinessTextLabel = "Mostly clear skies.";
    } else if (cloudiness >= 20 && cloudiness < 50) {
      cloudinessTextLabel = "Partly cloudy skies.";
    } else if (cloudiness >= 50 && cloudiness < 80) {
      cloudinessTextLabel = "Mostly cloudy skies.";
    } else {
      cloudinessTextLabel = "Overcast skies.";
    }
    return { cloudiness: `${cloudiness}%.`, cloudinessTextLabel };
  };
}
// };
/* ------------------------------------------------------------------------ */

// Change label color
export const getLabelsColorChanged = () => {
  const labels = document.querySelectorAll(".label");
  labels.forEach((label) => {
    const colonIndex = label.innerText.indexOf(":");
    if (colonIndex !== -1) {
      label.innerHTML = `<span style='font-weight: 900'>${label.innerText.substring(
        0,
        colonIndex
      )}</span>${label.innerText.substring(
        colonIndex,
        label.innerText.length
      )}`;
    }
  });
};

// Calculate air quality index
export function calculateAirQualityIndex(so2, no2, pm10, pm2_5, o3, co) {
  const AQI_CATEGORIES = [
    {
      name: "Good",
      so2: [0, 20],
      no2: [0, 40],
      pm2_5: [0, 20],
      pm10: [0, 10],
      o3: [0, 60],
      co: [0, 4400],
    },
    {
      name: "Fair",
      so2: [20, 80],
      no2: [40, 70],
      pm2_5: [10, 25],
      pm10: [20, 50],
      o3: [60, 100],
      co: [4400, 9400],
    },
    {
      name: "Moderate",
      so2: [80, 250],
      no2: [70, 150],
      pm2_5: [25, 50],
      pm10: [50, 100],
      o3: [100, 140],
      co: [9400, 12400],
    },
    {
      name: "Poor",
      so2: [250, 350],
      no2: [150, 200],
      pm2_5: [50, 75],
      pm10: [100, 200],
      o3: [140, 180],
      co: [12400, 15400],
    },
    {
      name: "Very Poor",
      so2: [350, Infinity],
      no2: [200, Infinity],
      pm2_5: [75, Infinity],
      pm10: [200, Infinity],
      o3: [180, Infinity],
      co: [15400, Infinity],
    },
  ];

  // Check which AQI category the pollutant concentrations fall into
  let aqiName;
  let aqiError;
  for (const category of AQI_CATEGORIES) {
    if (
      so2 >= category.so2[0] &&
      so2 <= category.so2[1] &&
      no2 >= category.no2[0] &&
      no2 <= category.no2[1] &&
      pm2_5 >= category.pm2_5[0] &&
      pm2_5 <= category.pm2_5[1] &&
      pm10 >= category.pm10[0] &&
      pm10 <= category.pm10[1] &&
      o3 >= category.o3[0] &&
      o3 <= category.o3[1] &&
      co >= category.co[0] &&
      co <= category.co[1]
    ) {
      aqiName = category.name;
      break;
    }
    aqiError = `Could not find AQI category for this value, SO2: ${so2}, NO2: ${no2}, PM10: ${pm10}, PM25: ${pm2_5}, O3:${o3}, CO:${co}`;
  }
  return { aqiName, aqiError };
}

// Convert temperature from celsius to fahrenheit or vice versa
export const convertTemperature = (temperature) => {
  let tempInCelsius = ((temperature - 32) / 1.8).toFixed(2);
  let tempInFahrenheit = (temperature * 1.8 + 32).toFixed(2);
  return {
    tempInCelsius: `${tempInCelsius}`,
    tempInFahrenheit: `${tempInFahrenheit}`,
  };
};

// Convert speed from mph to kph or vice versa
export const convertSpeed = (speed) => {
  let speedInKilometers = (parseFloat(speed) * 1.609).toFixed(2);
  let speedInMiles = (parseFloat(speed) / 1.609).toFixed(2);
  return {
    speedInMiles: `${speedInMiles} mph.`,
    speedInKilometers: `${speedInKilometers} kmph.`,
  };
};
