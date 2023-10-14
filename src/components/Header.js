import React, { useState } from "react";
import "../App.css";

const Header = (props) => {
  // Getting isDarkMode from App.js
  const { isDarkMode } = props;

  // Remove dev note on click
  const [close, setClose] = useState(false);
  const removeDevNote = () => {
    setClose(true);
    const devNoteDiv = document.querySelector(".developer_note_div");
    if (devNoteDiv) {
      devNoteDiv.remove();
    }
  };
  // -----------------------------------------------

  return (
    <>
      <div
        className={`developer_note_div ${
          isDarkMode ? "dark_mode" : "light_mode"
        }`}
      >
        <div className="developer_note_wrapper p-2 text-center">
          {!close && (
            <i
              className="fas fa-times position-absolute p-1 bg-light remove_dev_note_btn"
              style={{
                top: "0",
                right: "0",
                fontSize: "1.5rem",
                color: "red",
                border: "1px solid red",
                cursor: "pointer",
              }}
              onClick={removeDevNote}
            ></i>
          )}
          <p className="mb-0 p-1">
            Our search feature supports both city names and zip codes. To search
            by city name, enter the desired city's name in the search bar. If
            you prefer to search by zip code, add the country code along with
            the code itself. For instance, to find the zip code 75060 in the US,
            simply enter "75060, US" in the search bar (case-insensitive).
          </p>
          <span style={{ color: "#0D9BE5", fontWeight: "bold" }}>
            - Developer's note
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
