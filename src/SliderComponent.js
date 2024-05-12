import React, { useState } from 'react';

const SliderComponent = ({ onSliderChange, min, max, text, default_value }) => {
  const [sliderValue, setSliderValue] = useState(default_value); // Initial value

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setSliderValue(newValue);
    // Call the callback function from the parent
    onSliderChange(newValue);
  };

  return (
    <div style={{ display: 'flex' }}>
      {text &&  <label style={{ whiteSpace: 'nowrap' }}> {text} {sliderValue}</label>}
      <input
        style={{ width: "100%", backgroundColor: "white" }}
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default SliderComponent;
