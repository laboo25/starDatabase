import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from "react-icons/bs";
import './images.css';
import ImagesSidebar from '../sidebar/ImagesSidebar';

const Images = () => {
  const [images, setImages] = useState([]);
  const [starMap, setStarMap] = useState({});
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStarNames, setSelectedStarNames] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchStarData();
  }, []);

  useEffect(() => {
    if (Object.keys(starMap).length > 0) {
      fetchData(page);
    }
  }, [page, starMap]);

  const fetchStarData = async () => {
    try {
      const starsResponse = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
      const starData = starsResponse.data;
      const starMap = starData.reduce((map, star) => {
        map[star._id] = star.starname;
        return map;
      }, {});
      setStarMap(starMap);
    } catch (error) {
      console.error('Error fetching stars:', error);
      setError('Failed to fetch star data. Please try again later.');
    }
  };

  const fetchData = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const imagesResponse = await axios.get('https://stardb-api.onrender.com/api/stars/images/get-all-images', {
        params: { page }
      });
      const newImages = imagesResponse.data;

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        setImages(prevImages => {
          const uniqueImages = newImages.filter(newImage =>
            !prevImages.some(prevImage => prevImage._id === newImage._id)
          );
          return [...prevImages, ...uniqueImages];
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch image data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 50 && hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    const handleDebouncedScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', handleDebouncedScroll);
    return () => {
      window.removeEventListener('scroll', handleDebouncedScroll);
    };
  }, [loading, hasMore]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const getStarName = (starId) => {
    return starMap[starId] || 'Unknown';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStarNameChange = (selected) => {
    setSelectedStarNames(selected);
  };

  const handleTagChange = (selected) => {
    setSelectedTags(selected);
  };

  const filteredImages = images.filter(item => 
    (selectedStarNames.length === 0 || selectedStarNames.includes(getStarName(item.starId))) &&
    (selectedTags.length === 0 || item.starImages.some(image => image.tags.some(tag => selectedTags.includes(tag))))
  );

  const starNamesWithImages = [...new Set(filteredImages.map(item => getStarName(item.starId)))];
  const allTags = [...new Set(images.flatMap(item => item.starImages.flatMap(image => image.tags)))];

  return (
    <div className='flex'>
      <div className={`transition-width duration-300 ${isSidebarOpen ? 'w-[300px]' : 'w-0'} bg-slate-600 h-screen overflow-hidden`}>
        <ImagesSidebar 
          starNames={starNamesWithImages}
          tags={allTags}
          selectedStarNames={selectedStarNames}
          selectedTags={selectedTags}
          onStarNameChange={handleStarNameChange}
          onTagChange={handleTagChange}
        />
      </div>
      <div className='flex-1'>
        <button onClick={toggleSidebar} className='m-2 p-2 bg-blue-500 text-white'>
          Toggle Sidebar
        </button>
        <div id='image-main'>
          {error && <div className='error'>{error}</div>}
          <div id='images-wrapper'>
            {filteredImages.map((item, itemIndex) =>
              item.starImages.map((image, imageIndex) => (
                <div key={`${item._id}-${image._id}`} className='card' id='card'>
                  <div id='options' className='relative'>
                    <div id='squire-box'>
                      <a
                        href={image.imageurl}
                        data-fancybox="gallery"
                        data-caption={getStarName(item.starId)}
                        draggable="false"
                      >
                        <img src={image.imageThumb} alt={getStarName(item.starId)} draggable="false" />
                      </a>
                    </div>
                    {image.tags && image.tags.length > 0 && (
                      <div className="tags py-1 text-[#838383]">
                        {image.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div id='squire-box-options'>
                      <button><BsThreeDotsVertical /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {loading && <div className='loading'>Loading...</div>}
          {!loading && !hasMore && images.length > 0 && <div className='no-more-data'>No more images found.</div>}
          {!loading && images.length === 0 && <div className='no-images'>No images found.</div>}
        </div>
      </div>
    </div>
  );
};

export default Images;
