import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import './images.css';
import { Spin, message } from 'antd';
import axiosInstance from '../..//app/axiosInstance';


const StarImages = ({ starId }) => {
  const [loading, setLoading] = useState(true);
  const [starImages, setStarImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, [starId]);

  const fetchData = async () => {
    try {
      const [starsResponse, imagesResponse] = await Promise.all([
        axiosInstance.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star'),
        axiosInstance.get('https://stardb-api.onrender.com/api/stars/images/get-all-images')
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
            .filter(id => starMap[id])
            .map(id => starMap[id]);

          return {
            ...imageEntry,
            starNames: matchedStarNames,
            starImages: imageEntry.starImages || [], // Ensure starImages is an array
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
    <div id='star-img-main'>
        <div id='image-count' className='w-full flex justify-center items-center'>
            <div id="image-count-wrapper" className='w-auto h-auto text-center font-bold pt-3 uppercase text-[30px]'>
              <p id="image-count-text" className='font-black'>{starImages.length}</p>
              <p>images</p>
            </div>
        </div>
      <div id='images-wrapper' className="gallery">
        
        {starImages.map((item, index) => (
          item.starImages.map((image, imgIndex) => (
            <div key={`${index}-${imgIndex}`} id='card' className="card">
              <div id='options'>
                <div id="squire-box">
                  <a
                    href={image.imageurl}
                    data-fancybox="gallery"
                    data-caption={item.starNames.join(', ')}
                  >
                    <img
                      src={image.imageThumb}
                      alt={`Thumbnail of ${item.starNames.join(', ')}`} />
                  </a>
                  {image.tags && image.tags.length > 0 && (
                    <div className='tags'>
                      {image.tags.sort((a, b) => a.localeCompare(b)).map((tag, tagIdx) => (
                        <span key={tagIdx} className='tag'>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div id='squire-box-options'>
                  <button><BsThreeDotsVertical /></button>
                </div>
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default StarImages;
