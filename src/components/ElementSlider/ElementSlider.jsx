import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./ElementSlider.scss";

const ElementSlider = ({ location, value, type, valueChangeHandler }) => {
  let setColor = "#247ba0";
  location === "Rainy-Outdoors" ? (setColor = "#cbd4c2") : "#247ba0";
  location === "Beachside-Waves" ? (setColor = "#1a5a78") : "#247ba0";
  location === "Among-Trees" ? (setColor = "#fffcff") : "#247ba0";
  location === "Cozy-Lounge" ? (setColor = "#fffcff") : "#247ba0";

  return (
    <div className={`element-slider element-slider--${location}`}>
      {type === "volume" ? <VolumeDown /> : <RemoveIcon />}
      <Slider
        min={0}
        max={100}
        value={value}
        onChange={valueChangeHandler}
        sx={{
          color: setColor,
        }}
      />
      {type === "volume" ? <VolumeUp /> : <AddIcon />}
    </div>
  );
};

export default ElementSlider;
