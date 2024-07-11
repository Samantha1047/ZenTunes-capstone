import Slider from "@mui/material/Slider";
import "./ElementSlider.scss";

const ElementSlider = ({ location, value, valueChangeHandler }) => {
  return (
    <Slider
      className={`slider slider--${location}`}
      min={0}
      max={100}
      value={value}
      onChange={valueChangeHandler}
      /*       sx={{
        "& .MuiSlider-thumb": {
          color: "#247ba0",
        },
      }} */
    />
  );
};

export default ElementSlider;
