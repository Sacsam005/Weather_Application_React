import React from "react";

const Button = ({ classNames, style, onClick, buttonInnerText }) => {
  const defaultStyles = {
    boxShadow: "rgba(155, 154, 154, 0.6) 0px 2px 8px 0px",
    fontWeight: 900,
  };
  const mergedStyles = Object.assign({}, defaultStyles, style);

  return (
    <>
      <button
        className={`border border-0 rounded-0 mt-2 ${classNames}`}
        style={mergedStyles}
        onClick={onClick}
      >
        {buttonInnerText}
      </button>
    </>
  );
};

export const WeatherDataLabel = ({
  dataTitle,
  classNames,
  style,
  buttonInnerText,
}) => {
  const defaultStyles = {
    marginBottom: 0,
  };

  const mergedStyles = Object.assign({}, defaultStyles, style);
  return (
    <p data-title={dataTitle} className={classNames} style={mergedStyles}>
      {buttonInnerText}
    </p>
  );
};

export default Button;
