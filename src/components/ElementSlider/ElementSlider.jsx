import Slider from "@mui/material/Slider";
import "./ElementSlider.scss";

const ElementSlider = ({ location, value, valueChangeHandler }) => {
  let setColor = "#247ba0";
  location === "Rainy-Outdoors" ? (setColor = "#cbd4c2") : "#247ba0";
  location === "Beachside-Waves" ? (setColor = "#fffcff") : "#247ba0";

  return (
    <Slider
      className={`slider slider--${location}`}
      min={0}
      max={100}
      value={value}
      onChange={valueChangeHandler}
      sx={{
        color: setColor,
      }}
    />
  );
};

export default ElementSlider;
