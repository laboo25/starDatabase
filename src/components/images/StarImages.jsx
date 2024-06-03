import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, message } from 'antd';

const StarImages = () => {
  const [loading, setLoading] = useState(true);
  const [starImages, setStarImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [starsResponse, imagesResponse] = await Promise.all([
        axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star'),
        axios.get('https://stardb-api.onrender.com/api/stars/images/get-all-images')
      ]);

      const starsData = starsResponse.data;
      const imagesData = imagesResponse.data;

      // Map images to their corresponding stars
      const starImagesMap = imagesData
        .map(imageEntry => {
          const starNames = imageEntry.starname.map(starId => {
            const star = starsData.find(star => star._id === starId);
            return star ? star.starname : 'Unknown';
          }).filter(starname => starname !== 'Unknown');

          return {
            ...imageEntry,
            starNames, // Ensure we have the starNames
            starImages: imageEntry.starImages // Ensure we have the starImages
          };
        })
        .filter(imageEntry => imageEntry.starNames.length > 0); // Only include entries with valid star names

      setStarImages(starImagesMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <div>
      <h2>Star Images</h2>
      <div className="gallery">
        {starImages.map((item, idx) => (
          <div key={idx} className="card sm:w-full max-w-[300px]">
            {item.starImages.map((image, index) => (
              <a key={index} href={image.imageurl} data-fancybox="gallery" data-caption={item.starNames.join(', ')}>
                <img src={image.imageThumb} alt={`Thumbnail of ${item.starNames.join(', ')}`} />
              </a>
            ))}
            <ul className='w-full flex gap-2 capitalize'>
              {item.starImages.map((image, index) => (
                image.tags.map((tag, tagIdx) => (
                  <li key={tagIdx}>{tag}</li>
                ))
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarImages;
