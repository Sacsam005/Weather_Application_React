import React from "react";

const WeatherProperty = ({
  classNames,
  title,
  dataTitle,
  weatherPropData,
  weatherPropText,
  src,
  style,
}) => {
  return (
    <>
      <div className={classNames} title={title}>
        <h6 data-title={dataTitle} className="label" style={style}>
          {title}: {weatherPropData} <br /> {weatherPropText}
        </h6>
        <img src={src} alt={title} />
      </div>
    </>
  );
};

export default WeatherProperty;
