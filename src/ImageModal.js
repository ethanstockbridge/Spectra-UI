import { React, useEffect } from 'react';
import AudioComponent from './AudioComponent';
import './ImageModal.css';
import imageLeft from './arrow_left.png';
import imageRight from './arrow_right.png';

const ImageModal = ({ imageUrl, audioUrl, onCloseFunc }) => {

  const onPrevious = () => {
    onCloseFunc(-1);
  }

  const onNext = () => {
    onCloseFunc(1);
  }

  const onClose = () => {
    onCloseFunc(0);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowLeft') {
        onPrevious();
      }
      if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageUrl, audioUrl]);


  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.7)' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '80%', maxHeight: '80%' }}>
        <img src={imageUrl} alt="Enlarged Image" className='image-view' />
          {audioUrl && <AudioComponent audioUrl={audioUrl} />}
          <button onClick={onPrevious} style={{ position: 'absolute', top: '40%', left: '-60px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
            <img src={imageLeft} style={{height:'50px'}}/>
          </button>
          <button onClick={onNext} style={{ position: 'absolute', top: '40%', right: '-60px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
            <img src={imageRight} style={{height:'50px'}}/>
          </button>
          <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
            &times;
          </button>
      </div>
    </div>
  );
};


export default ImageModal;
