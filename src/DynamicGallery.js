import React, { useState } from 'react';
import ImageModal from './ImageModal';

const DynamicGallery = ({ images, width }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(null);

  const openModal = (imageUrl, index) => {
    console.log("opening modal")
    setSelectedImage(imageUrl);
    setSelectedImageIdx(index);
  };
  
  const closeModal = (idx_change) => {
    // setSelectedImage(null);
    if (idx_change === 0) {
      setSelectedImage(null);
    } else {
      // Update selectedImageIdx based on idx_change
      const nextImageIdx = selectedImageIdx + idx_change;
  
      // Check if nextImageIdx is within the bounds of the images array
      if (nextImageIdx >= 0 && nextImageIdx < images.length) {
        // Update selectedImage and selectedImageIdx
        const nextImage = images[nextImageIdx];
        setSelectedImage(nextImage);
        setSelectedImageIdx(nextImageIdx);
      }
      else {
        // Handle out-of-bounds index or any other logic you need
        if (nextImageIdx == -1) {
          // go from beginning to end
          const nextImage = images[images.length-1];
          setSelectedImage(nextImage);
          setSelectedImageIdx(images.length-1);
        }
        else
        {
          // go from end to beginning
          const nextImage = images[0];
          setSelectedImage(nextImage);
          setSelectedImageIdx(0);
        }
      }
    }
  }

  if (!images || images.length === 0) {
    return <div>No images to display.</div>;
  }
  // Calculate the minimum width of each image
  if (!width || width === 0){
    width = 300;
  }
  const minImageWidth = width;
  
  return (
    <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: `repeat(auto-fit, minmax(${minImageWidth}px, 1fr))` }}>
      {images.map((imageUrl, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            style={{ width: '100%', maxWidth:'400px', height: 'auto', cursor: 'pointer' }}
            onClick={() => openModal(imageUrl, index)}
          />
        </div>
      ))}
      {selectedImage && <ImageModal imageUrl={selectedImage} audioUrl={selectedImage.replace("image","audio")} onCloseFunc={closeModal} />}
    </div>
  );
};


export default DynamicGallery;
