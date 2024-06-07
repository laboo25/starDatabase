import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from "react-icons/bs";
import './images.css';
import { v4 as uuidv4 } from 'uuid';

const Images = () => {
  const [images, setImages] = useState([]);
  const [stars, setStars] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const starsResponse = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
      setStars(starsResponse.data);

      const imagesResponse = await axios.get('https://stardb-api.onrender.com/api/stars/images/get-all-images');
      setImages(imagesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  const getStarName = (starId) => {
    const star = stars.find((s) => s._id === starId);
    return star ? star.starname : 'Unknown';
  };

  return (
    <div id='image-main'>
      {error && <div className='error'>{error}</div>} {/* Display error message */}
      <div id='images-wrapper'>
        {images.map((item) => 
          item.starImages.map((image) => (
            <div key={uuidv4()} className='card' id='card'>
              <div id='options' className='relative'>
              <div id='squire-box'>
                <a
                  href={image.imageurl}
                  data-fancybox="gallery"
                  data-caption={getStarName(image.starname)} // Use caption if available, otherwise fallback to star name
                  draggable="false"
                >
                  <img src={image.imageThumb} alt='' draggable="false" />
                </a>
              </div>
              {image.tags && image.tags.length > 0 && (
                <div className="tags">
                  {image.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div id='squire-box-options' >
                  <button><BsThreeDotsVertical /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Images;
