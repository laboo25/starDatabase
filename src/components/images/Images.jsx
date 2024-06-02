import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './images.css';

const Images = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        'http://localhost:1769/api/stars/images/get-all-images'
      );
      setImages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <>
      <div id='image-main'>
        <div id='image-wrapper'>
          {images.map((item, index) => (
            item.starImages.map((image, idx) => (
              <div key={idx} id='card'>
                <div id='squire-box'>
                  <a href={image.imageurl} data-fancybox="gallery" draggable="false">
                    <img src={image.imageThumb} alt="Sample" draggable="false" />
                  </a>
                </div>
              </div>
            ))
          ))}
        </div>
      </div>
    </>
  );
};

export default Images;
