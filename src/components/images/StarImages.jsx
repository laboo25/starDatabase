import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, message } from 'antd';

const StarImages = ({ starId }) => {
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

      // Create a map of star IDs to star names
      const starMap = starsData.reduce((acc, star) => {
        acc[star._id] = star.starname;
        return acc;
      }, {});

      // Filter and map images to their corresponding stars
      const starImagesMap = imagesData
        .filter(imageEntry => imageEntry.starname.includes(starId)) // Filter images by the current starId
        .map(imageEntry => {
          const matchedStarNames = imageEntry.starname
            .filter(starId => starMap[starId])
            .map(starId => starMap[starId]);

          return {
            ...imageEntry,
            starNames: matchedStarNames,
          };
        });

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

  if (starImages.length === 0) {
    return <div>No images available for this star.</div>;
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
                image.tags.sort((a, b) => a.localeCompare(b)).map((tag, tagIdx) => ( // Sorting tags in ascending order
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
