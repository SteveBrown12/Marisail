import React, { useState } from "react";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="gallery-container">
      <div className="main-image-section">
        <img src={selectedImage} alt="Main" className="main-image" />
      </div>
      <div className="thumbnail-section">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`thumbnail ${selectedImage === image ? "active" : ""}`}
            onClick={() => handleThumbnailClick(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
