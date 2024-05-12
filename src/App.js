import React from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DetectContent from './DetectContent';
import RecordContent from './RecordContent';
import ViewerContent from './ViewerContent';
import logo from './logo_banner.png';

function App() {
  const status_bar_color = "#464C4F";

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="Spectra Logo" style={{ height: '80px', padding: '0px', margin: '0px', paddingTop: '5px' }} />
          <h2 style={{ padding: '0px', margin: '0px', position: 'absolute', left: '34px', top: '50px' }}>Spectra</h2>
        </header>

        <div className="tabs">
          <Link to="/record" className="tab">
            Record
          </Link>
          <Link to="/detect" className="tab">
            Detect
          </Link>
          <Link to="/viewer" className="tab">
            Viewer
          </Link>
        </div>

        <div className="tab-content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/record"/>}/>
            <Route path="/record" element={<RecordContent/>}/>
            <Route path="/detect" element={<DetectContent/>}/>
            <Route path="/viewer" element={<ViewerContent/>}/>
            <Route path="/viewer/:datasetName" element={<ViewerContent/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
