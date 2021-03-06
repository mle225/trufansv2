import React from "react";
import Slider from "@mui/material/Slider";
import moment from "moment";

const Timeline = ({ setStart, setEnd, startTime1, endTime1, maxValue }) => {
  const endLabel = moment().startOf("day").seconds(maxValue).format("mm:ss");

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setStart(newValue[0]);
    setEnd(newValue[1]);
  };

  return (
    <div className="timeline col w-75 pb-3" style={{ paddingLeft: "25%" }}>
      <div className="row">
        <Slider
          min={0}
          max={maxValue}
          value={[startTime1, endTime1]}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => {
            return moment().startOf("day").seconds(val).format("mm:ss");
          }}
          step={0.1}
          color={"primary"}
          aria-labelledby="range-slider"
        />
      </div>
      <div className="row">
        <div className="time-label col text-left text-muted">
          <span>00:00 / </span>
          <span>{endLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
