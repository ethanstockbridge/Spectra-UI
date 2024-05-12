import React, { useEffect, useState } from 'react';

const RemoteAudioRequestor = ({ onTimerReady, timeoutSec }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        onTimerReady();
        if (Date.now() > endTime) {
          handleStartStop();
          return;
        }
      }, 2000);
    }

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, onTimerReady, endTime]);

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
    setEndTime(Date.now() + timeoutSec);
  };

  return (
    <div>
      <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
      {isRunning && <span>Running...</span>}
    </div>
  );
};

export default RemoteAudioRequestor;
