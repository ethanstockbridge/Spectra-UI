import React, { useRef, useState } from 'react';

const useTimer = () => {
  const intervalRef = useRef(null);

  const start = (duration, callback) => {
      intervalRef.current = setInterval(callback, duration);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return { start, stop };
};

const AudioRecorder = ({ onDataAvailable, timeoutSec }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chunkDuration = 3100; //ms
  const { start, stop } = useTimer();
  const chunkIdRef = useRef(0);
  const [errorMessage, setErrorMessage] = useState('');

  // const audioType = 'audio/webm';
  const audioType = 'audio/wav';

  const startRecording = async (end_time) => {
    if(Date.now()>end_time)
    {
      stopStream();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { type: audioType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: audioType });
        onDataAvailable(audioBlob,chunkIdRef.current);
        chunkIdRef.current += 1;
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      // Start a timer to check the duration and trigger callbacks
      start(chunkDuration, () => {
          stopRecording();
          startRecording(end_time);
      });
    } catch (error) {
      setErrorMessage(`Error accessing microphone: ${error.message}`);
      console.error('Error accessing microphone:', error.message);
    }
  };

  const startStream = () => {
    console.log("Time now: ")
    console.log(Date.now())
    console.log("Timeout: ")
    console.log(timeoutSec)
    const end_time = Date.now()+timeoutSec
    startRecording(end_time);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      stop();
    }
  };
  
  const stopStream = () => {
    stopRecording();
    setIsRecording(false);
  }

  return (
    <div>
      <button onClick={startStream} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      <button onClick={stopStream} disabled={!isRecording}>
        Stop Recording
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default AudioRecorder;
