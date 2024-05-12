import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label } from 'reactstrap';
import API_URLS from './api';
import "./common.css";

const DetectUI = () => {
  const [saveTag, setSaveTag] = useState("dataset_"+Math.round(new Date().getTime() / 1000));
  const [minConfidence, setMinConfidence] = useState('0.2');
  const [selectedFile, setSelectedFile] = useState('');
  const dataset_api= API_URLS.flask_api+"dataset/"
  const [datasetLog,setDatasetLog] = useState();
  const [submitted,setSubmitted] = useState(false);
  const navigate = useNavigate();
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, [datasetLog]); // Trigger scrolling whenever datasetLog changes

  const uploadWavFile = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('minConfidence', minConfidence);
      const unixTimestampInSeconds = selectedFile.lastModifiedDate.getTime() / 1000;
      formData.append('startDate', unixTimestampInSeconds);
      console.log(unixTimestampInSeconds)

      try {
        const response = await fetch(dataset_api+"create_dataset/"+saveTag, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const result = await response.json();
        console.log('Upload successful:', result);
        setSubmitted(true);
      } catch (error) {
        console.error('Error uploading file:', error.message);
        setDatasetLog("Error uploading file, please refresh and try again."
        +" Make sure that your media file is playable, and the server is on.")
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };


  const updateLog = async () => {
    try {
      const response = await fetch(dataset_api+"get_dataset_log/"+saveTag);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      if(result.status=="error")
      {
        setDatasetLog("Error: "+result.message)
      }
      else //result.get('status')==ok
      {
        setDatasetLog(result.log);
        if(result.log.toLowerCase().includes("complete"))
        {
          setSubmitted(false);
          navigate('/viewer/'+saveTag);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    let pollingInterval;

    const startPolling = () => {
      updateLog();
      pollingInterval = setInterval(updateLog, 2000);
      return () => clearInterval(pollingInterval);
    };

    const stopPolling = () => {
      clearInterval(pollingInterval);
    };

    // Check if isSubmitted is true before starting the polling
    if (submitted) {
      const cleanup = startPolling();

      // Set a timeout to stop polling after 30 seconds if it's not turned off manually
      const timeoutId = setTimeout(() => {
        stopPolling();
        setSubmitted(false); // Optionally, reset isSubmitted to false
      }, 900000);

      return () => {
        cleanup();
        clearTimeout(timeoutId); // Clear the timeout when the component unmounts or isSubmitted changes
      };
    }

    // If isSubmitted is false, return an empty cleanup function
    return () => {};
  }, [submitted]); // Dependency on isSubmitted to re-run the effect when it changes


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
      <div className='bubbly-container'>
        <div>
          <Label>
            Wav file to parse:
            <input type="file" accept=".wav" onChange={handleFileChange} />
          </Label>
        </div>

        <br/>

        <div>
          <Label>
            New tag of dataset:
            <Input type="text" value={saveTag} onChange={(e) => setSaveTag(e.target.value)} />
          </Label>
        </div>

        <br/>

        <div>
          <Label>
            Min confidence:
            <Input type="text" value={minConfidence} onChange={(e) => setMinConfidence(e.target.value)} />
          </Label>
        </div>

        <br/>

        <Button onClick={() => uploadWavFile(selectedFile)}>Parse Recording</Button>

      </div>
      <div className='bubbly-container' style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap' }} ref={scrollBoxRef}>
        Log:
        <br/>
        {datasetLog}
      </div>
    </div>
);
};

export default DetectUI;
