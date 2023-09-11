import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import WeatherDashboardWithAllProps from "./Components/WeatherDashboard";
import Footer from "./Components/Footer";
import "./App.css";

const App = () => {
  // Toggle theme from dark to light and vice versa
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    function darkModeForSmallerDiv(domObject) {
      domObject.forEach((div) => {
        if (isDarkMode === false) {
          div.style.backgroundColor = "#E3E6E6";
          div.style.color = "#222";
        } else {
          div.style.backgroundColor = "#424242";
          div.style.color = "#ddd";
        }
      });
    }

    const weatherPropsColumn = document.querySelectorAll(
      ".weather_props_column"
    );
    const citiesDiv = document.querySelectorAll(".cities_div");
    const weatherUpdateDiv = document.querySelectorAll(".weather_update_div");

    darkModeForSmallerDiv(weatherPropsColumn);
    darkModeForSmallerDiv(citiesDiv);
    darkModeForSmallerDiv(weatherUpdateDiv);
  }, [isDarkMode]);

  return (
    <>
      <Header isDarkMode={isDarkMode} />
      <WeatherDashboardWithAllProps
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <Footer isDarkMode={isDarkMode} />
    </>
  );
};

export default App;
