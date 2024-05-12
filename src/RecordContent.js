import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioRecorder from './AudioRecorder';
import RemoteAudioRequestor from './RemoteAudioRequestor';
import API_URLS from './api';
import "./common.css";

const RecordUI = () => {
  const [checkboxRemote, setCheckboxRemote] = useState(true);
  const [checkboxOnDevice, setCheckboxOnDevice] = useState(false);

  // const timeLimitRecordingMinutes = 100; //100 minutes
  const timeLimitRecordingMinutes = 24*60; //24 hours

  const [checkboxVisualization, setCheckboxVisualization] = useState(true);
  const [checkboxDetection, setCheckboxDetection] = useState(true);
  const [boolSparseSave, setBoolSparseSave] = useState(true);

  const [lineeditIp, setLineeditIp] = useState('192.168.1.109');
  const [lineeditPort, setLineeditPort] = useState('5029');
  const [lineeditRecordingLimit, setLineeditRecordingLimit] = useState(15);
  const [lineeditAudioGain, setLineeditAudioGain] = useState(1);
  const [lineeditSavePath, setLineeditSavePath] = useState("dataset_"+Math.round(new Date().getTime() / 1000));
  const [lineeditConfMin, setLineeditConfMin] = useState(0.2); // Add this line
  const [spectogramID, setSpectogramID] = useState('');
  const [selectedOption, setSelectedOption] = useState('untilStop');
  const [boolDatasetCreated, setBoolDatasetCreated] = useState(false);
  const parse_record_api=API_URLS.flask_api+"record/"
  const [sensorAPI, setSensorAPI] = useState('192.168.1.173')
  const [sensorReport, setSensorReport] = useState("");
  // Guess if its a mobile device
  const maxMobileWidth = 767;
  const isMobile = window.innerWidth <= maxMobileWidth;

  const navigate = useNavigate();

  const routeChange = () =>{
    navigate("/viewer/"+lineeditSavePath);
  }

  const queryResults = async (blob, chunkId) =>
  {
    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append("detection", checkboxDetection)
      formData.append("gain", lineeditAudioGain!=""?lineeditAudioGain:1)
      formData.append("chunkID", chunkId)
      formData.append("minConf", lineeditConfMin!=""?lineeditConfMin:0.2)
      formData.append("weatherStationApi",sensorAPI)
      formData.append("remoteIP",lineeditIp)
      formData.append("remotePort",lineeditPort)
      formData.append("noSave",boolSparseSave)
      
      var api_endpoint=""

      if(checkboxOnDevice)
      {
        console.log("on device")
        api_endpoint=parse_record_api+"parse_local_recording/"+lineeditSavePath
      }
      if(checkboxRemote)
      {
        console.log("remote")
        api_endpoint=parse_record_api+"parse_remote_recording/"+lineeditSavePath
      }

      const response = await fetch(api_endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze dataset');
      }

      const result = await response.json();
      console.log(result.image)
      if(result.image!=null)
      {
        setSpectogramID(result.image);
      }
      if(result.sensorReport!=null)
      {
        setSensorReport(result.sensorReport)
      }
      setBoolDatasetCreated(true);
    } catch (error) {
      console.error('Error parsing recording:', error.message);
    }
  };

  const callbackRecordContent = async (audioBlob, chunkId) => {
    // const chunk = blobToByteArray(audioBlob, queryResults, chunkId);
    queryResults(audioBlob, chunkId);
  };

  useEffect(() => {
    // checkbox verification
    if(!checkboxVisualization && checkboxDetection)
    {
      setCheckboxDetection(false);
    }
    else if(checkboxDetection)
    {
      setCheckboxVisualization(true);
    }
  }, [checkboxVisualization]);

  useEffect(() => {
    // checkbox verification (overloads previous)
    if(checkboxDetection)
    {
      setCheckboxVisualization(true);
    }
  }, [checkboxDetection]);


  return (
    <div>
        {/* Left side */}
        <div className="container">
            <div className='half-container'>

              <div>
                <h1>
                  Recording interface
                </h1>
              </div>

              <label>Recording Options:</label>
                <div className='bubbly-container'>

                  <div>
                    <input
                      type="radio"
                      name="recordSource"
                      value="Remote IP"
                      checked={checkboxRemote}
                      onChange={() => setCheckboxRemote(!checkboxRemote) || setCheckboxOnDevice(!checkboxOnDevice)}
                    />
                    <span>Remote. IP:</span>
                    <input type="text" value={lineeditIp} onChange={(e) => setLineeditIp(e.target.value)} />
                    <span>Port:</span>
                    <input type="text" value={lineeditPort} onChange={(e) => setLineeditPort(e.target.value)} />
                  </div>

                  <div>
                    <input
                      type="radio"
                      name="recordSource"
                      value="Current device"
                      checked={checkboxOnDevice}
                      onChange={() => setCheckboxOnDevice(!checkboxOnDevice) || setCheckboxRemote(!checkboxRemote)}
                    />
                    <span> Record on current device (if capable) </span>
                    {isMobile &&  
                      <span> - Please see <a href="https://github.com/ethanstockbridge/Spectra-UI?tab=readme-ov-file#mobile-recording">here</a> for details for mobile recording.</span>
                    }
                  </div>

                <div>
                    <span> Sensor API: </span>
                    <input type="text" value={sensorAPI} onChange={(e) => setSensorAPI(e.target.value)} />
                </div>
              </div>

              <div className='bubbly-container'>
                  <label>Record Duration:</label>
                  <div>
                  {/* <input type="checkbox" checked={checkboxUntilStop} onChange={() => setCheckboxUntilStop(!checkboxUntilStop)} /> */}
                  <input
                    type="radio"
                    name="recordTime"
                    value="untilStop"
                    checked={selectedOption === 'untilStop'}
                    onChange={() => setSelectedOption('untilStop')}
                  />
                  <span>Until stopped</span>
                  </div>
                  <div>
                  {/* <input type="checkbox" checked={checkboxTimed} onChange={() => setCheckboxTimed(!checkboxTimed)} /> */}
                  <input
                    type="radio"
                    name="recordTime"
                    value="timed"
                    checked={selectedOption === 'timed'}
                    onChange={() => setSelectedOption('timed')}
                  />
                  <span>Timed </span>
                    {selectedOption === 'timed' && (
                      <>
                        <input
                          type="text"
                          value={lineeditRecordingLimit}
                          onChange={(e) => setLineeditRecordingLimit(e.target.value)}
                        />
                        <span> minutes</span>
                      </>
                    )}
                  </div>
                </div>

                <div className='bubbly-container'>
                  <div>
                      <label>Audio gain:</label>
                      <input type="text" value={lineeditAudioGain} onChange={(e) => setLineeditAudioGain(e.target.value)} />
                  </div>

                  <br/>

                  <div>
                      <label>Save label:</label>
                      <input type="text" value={lineeditSavePath} onChange={(e) => setLineeditSavePath(e.target.value)} />
                  </div>

                  <br/>

                  <div>
                      <input type="checkbox" checked={checkboxVisualization} onChange={() => setCheckboxVisualization(!checkboxVisualization)} />
                      <label> Visualization</label>
                  </div>

                  <br/>

                  <div>
                      <input type="checkbox" checked={checkboxDetection} onChange={() => setCheckboxDetection(!checkboxDetection)} />
                      <label> Run detection</label>
                  </div>
                  
                  <br/>

                  <div>
                      <input type="checkbox" checked={boolSparseSave} onChange={() => setBoolSparseSave(!boolSparseSave)} />
                      <label> Sparsely save images/audio (good validation but keeps disc space down)</label>
                  </div>

                  <br/>
                  
                  <div>
                      <span>Min confidence</span>
                      <input type="text" value={lineeditConfMin} onChange={(e) => setLineeditConfMin(e.target.value)} />
                  </div>
                </div>

                <br/>

                { !checkboxRemote ? <AudioRecorder onDataAvailable={callbackRecordContent} timeoutSec={selectedOption === 'timed' ? lineeditRecordingLimit*1000*60 : timeLimitRecordingMinutes*60*1000 /*~100min*/}/> : <></> }

                { checkboxRemote ? <RemoteAudioRequestor onTimerReady={callbackRecordContent} timeoutSec={selectedOption === 'timed' ? lineeditRecordingLimit*1000*60 : timeLimitRecordingMinutes*60*1000 /*~100min*/} /> : <></> }


                {boolDatasetCreated ? <button onClick={routeChange}>Go to "{lineeditSavePath}"</button>:<></>}
            </div>
            {/* Right side with spectrogram image */}
            <div className='half-container'>
                <div>
                    {/* Placeholder for the image */}
                    { sensorReport ? <div style={{ whiteSpace: 'pre-wrap' }}>{ sensorReport }</div> : ("Weather report will be displayed here") }
                    <br/>
                    { spectogramID ? <img src={API_URLS.flask_api+"image/"+spectogramID} alt="Spectrogram" style={{ width: '100%' }} /> : <> Recorded Spectrogram displayed here </>} 
                </div>
            </div>
        </div>

    </div>
  );
};

export default RecordUI;
