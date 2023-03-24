import React from "react";

const Footer = (props) => {
  // Getting isDarkMode from App.js
  const { isDarkMode } = props;

  return (
    <>
      <div className={`footer_div ${isDarkMode ? "dark_mode" : "light_mode"}`}>
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "unset" }}
        >
          <i className="fas fa-bolt" style={{ color: "#0CB0FF" }}></i> Powered
          by OpenWeatherMap.org
        </a>
        <p className="mt-2 mb-0">
          A big shout out to OpenWeatherMap for this free and easy to use API.
        </p>
      </div>
    </>
  );
};

export default Footer;
