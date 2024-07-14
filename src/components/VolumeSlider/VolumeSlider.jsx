import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import "./VolumeSlider.scss";

const VolumeSlider = ({ location, volume, volumeChangeHandler }) => {
  return (
    <div className={`volume-control volume-control--${location}`}>
      <VolumeDown />
      <Slider
        aria-label="Volume"
        className={`volume-control__slider volume-control__slider--${location}`}
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={volumeChangeHandler}
        sx={{
          color: "#fffcff",
        }}
      />
      <VolumeUp />
    </div>
  );
};

export default VolumeSlider;
