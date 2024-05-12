import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'reactstrap'; // You may need to install a library like 'reactstrap' for styling
import AudioComponent from './AudioComponent';
import DynamicGallery from './DynamicGallery';
import SliderComponent from './SliderComponent';
import API_URLS from './api';
import "./common.css";
import loading from "./loading.gif";


const ViewUI = () => {
  const dataset_api= API_URLS.flask_api+"dataset/"
  const [start_time, set_start_time] = useState('');
  const [end_time, set_end_time] = useState('');
  const [additional_metrics, set_additional_metrics] = useState('');
  const [dataset_metrics, set_dataset_metrics] = useState('');
  const [graph_species_distribution, set_graph_species_distribution] = useState('');
  const [graph_species_count, set_graph_species_count] = useState('');
  const [graph_sensors, set_graph_sensors] = useState('');
  const [available_datasets, set_available_datasets] = useState([]);
  let { datasetName } = useParams();
  const [selectedDataset, setSelectedDataset] = useState(datasetName!=null ? datasetName : '');
  const [images, setImages] = useState([]);
  const [imageWidth, setImageWidth] = useState(150);
  const navigate = useNavigate();

  const secondsToDateTime = (seconds) => {
    // Convert seconds to milliseconds
    const milliseconds = seconds * 1000;
    // Create a new Date object with milliseconds
    const date = new Date(milliseconds);
    // Format the date as desired (example format: YYYY-MM-DD HH:mm:ss)
    const formattedDateTime = date.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' });
    return formattedDateTime;
  }
  
  useEffect(() => {
    // Load initial images and metrics when the component mounts
    fetchDatasets();
  }, []);

  useEffect(() => {
    navigate("/viewer/"+selectedDataset);
    if (selectedDataset) {
      processDataset(selectedDataset);
    }
  }, [selectedDataset]); // Fetch dataset whenever the selected dataset changes

  const fetchDatasets = async () => {
    try {
      const response = await fetch(dataset_api+"get_available_datasets", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedDataset }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze dataset');
      }

      const result = await response.json();
      set_available_datasets(result.datasets);
      console.log(datasetName)
      // navigate("/viewer/"+selectedDataset);
      if (result.datasets.length > 0) {
        if(datasetName==null)
        {
          setSelectedDataset(result.datasets[0]);
        }
      }
  } catch (error) {
      console.error('Error analyzing dataset:', error.message);
    }
  };

  const DeleteDataset = async(dataset) => {
    if(window.confirm('Delete the item?'))
    {
      try {
        const response = await fetch(dataset_api+"delete_dataset", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dataset }),
        });
        navigate("/");
      } catch (error) {
        set_dataset_metrics("Dataset data failed to be found")
        console.error('Error analyzing dataset:', error.message);
      }
    }
    else
    {
      ;
    }
  }

  const processDataset = async (dataset) => {
      set_dataset_metrics("Fetching dataset data")
      set_graph_species_distribution(loading);
      set_graph_species_count(loading);
      set_graph_sensors(loading);
      setImages([loading]);
      try {
      const response = await fetch(dataset_api+"get_dataset", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataset }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze dataset');
      }

      const result = await response.json();
      set_graph_species_distribution(result.graph_distribution);
      set_graph_species_count(result.graph_count)
      set_graph_sensors(result.graph_sensors)
      set_dataset_metrics(result.text);
      setImages(result.images)
      set_additional_metrics(result.additional_metrics)
      set_start_time(secondsToDateTime(result.start_time));
      set_end_time(secondsToDateTime(result.end_time));
    } catch (error) {
      set_dataset_metrics("Dataset data failed to be found")
      console.error('Error analyzing dataset:', error.message);
    }
  };

  const handleSliderChange = (newValue) => {
    // Do something with the updated slider value in the parent component
    setImageWidth(newValue);
  };

  return (
    <div className='container'>
      <div className='half-container'>
        <div>
          <label>Tag to load data from: </label>
          <select
            value={selectedDataset}
            onChange={e => setSelectedDataset(e.target.value)}
          >
            <option value="" disabled>
              Choose a dataset
            </option>
            {available_datasets.map(dataset => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </select>
          <Button onClick={() => DeleteDataset(selectedDataset)}>Delete dataset</Button>
        </div>

        {/* <div style={{ paddingBottom: '10px', whiteSpace: 'pre-wrap' }}>{ dataset_metrics }</div> */}

        <br/>
        <label>Start time:</label>
        <div style={{ paddingBottom: '10px', whiteSpace: 'pre-wrap' }}>{ start_time }</div>

        <label>End time:</label>
        <div style={{ paddingBottom: '10px', whiteSpace: 'pre-wrap' }}>{ end_time }</div>

        <div style={{ paddingBottom: '10px', whiteSpace: 'pre-wrap', maxWidth: '500px' }}>{ additional_metrics }</div>
        

        <AudioComponent audioUrl={API_URLS.flask_api+"full_audio/"+selectedDataset} />

        <img src={graph_species_distribution} alt="Species vs Time" style={{ width: '100%', maxWidth: '500px' }} />

        <br/>
        <img src={graph_species_count} alt="Species counts" style={{ width: '100%', maxWidth: '500px' }} />

        <br/>
        <img src={graph_sensors} alt="Species counts" style={{ width: '100%', maxWidth: '500px' }} />

        <div style = {{ display: 'flex' }}>
          <a href={dataset_api+'download_dataset/'+selectedDataset}><div className='bubbly-container' style = {{ color: "white" }}>Download dataset ZIP</div></a>
          <a href={dataset_api+'download_dataset_csv/'+selectedDataset}><div className='bubbly-container' style = {{ color: "white" }}>Download dataset CSV</div></a>
        </div>

      </div>

      <div className='half-container' style={{ flexGrow: 1 }}>
          <div style={{ paddingBottom: '20px' }}>
            <SliderComponent onSliderChange={handleSliderChange} min={50} max={350} default_value={imageWidth} text="Image size (px):"/>
          </div>
          <DynamicGallery images={images} width={imageWidth} />
      </div>

    </div>
  );
};

export default ViewUI;
