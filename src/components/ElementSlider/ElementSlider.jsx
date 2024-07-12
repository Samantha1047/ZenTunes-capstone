import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import "./ElementSlider.scss";

const ElementSlider = ({ location, value, type, valueChangeHandler }) => {
  let setColor = "#247ba0";
  location === "Rainy-Outdoors" ? (setColor = "#cbd4c2") : "#247ba0";
  location === "Beachside-Waves" ? (setColor = "#1a5a78") : "#247ba0";

  return (
    <div className={`element-slider element-slider--${location}`}>
      {type === "volume" ? <VolumeDown /> : <RemoveCircleOutlineIcon />}
      <Slider
        min={0}
        max={100}
        value={value}
        onChange={valueChangeHandler}
        sx={{
          color: setColor,
        }}
      />
      {type === "volume" ? <VolumeUp /> : <AddCircleOutlineIcon />}
    </div>
  );
};

export default ElementSlider;
