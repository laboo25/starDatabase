import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FloatButton, Pagination } from 'antd';
import './images.css';
import ImagesSidebar from '../sidebar/ImagesSidebar';
import axiosInstance from '../../app/axiosInstance'; // Import axiosInstance
import { TfiLayoutGrid3Alt, TfiLayoutGrid4Alt } from "react-icons/tfi";

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
  const [selectedLogic, setSelectedLogic] = useState('AND'); // State for logical operation
  const [pageSize, setPageSize] = useState(100); // Set default page size to 100

  useEffect(() => {
    fetchStarData();
  }, []);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize]);

  const fetchStarData = async () => {
    try {
      const starsResponse = await axiosInstance.get('/stars/create-star/get-all-star');
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

  const fetchData = async (page, pageSize) => {
    if (loading) return;
    setLoading(true);
    try {
      const imagesResponse = await axiosInstance.get('/stars/images/get-all-images', {
        params: { page, pageSize }
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

  const handleLogicChange = (logic) => {
    setSelectedLogic(logic);
  };

  const filterImagesByTags = (images, tags, logic) => {
    if (tags.length === 0) return images;

    return images.filter(item => {
      const itemTags = item.starImages.flatMap(image => image.tags);

      if (logic === 'AND') {
        return tags.every(tag => itemTags.includes(tag));
      } else if (logic === 'OR') {
        return tags.some(tag => itemTags.includes(tag));
      } else if (logic === 'NOT') {
        return tags.every(tag => !itemTags.includes(tag));
      }
      return true;
    });
  };

  const filteredImages = filterImagesByTags(images.filter(item =>
    selectedStarNames.length === 0 || selectedStarNames.includes(getStarName(item.starId))
  ), selectedTags, selectedLogic);

  const starNamesWithImages = [...new Set(images.map(item => getStarName(item.starId)))];
  const allTags = [...new Set(images.flatMap(item => item.starImages.flatMap(image => image.tags)))];

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPage(1); // Reset to the first page when page size changes
  };

  return (
    <div className='flex'>
      <div className={`transition-width duration-300 ${isSidebarOpen ? 'w-[300px]' : 'w-0'} bg-slate-600 h-screen overflow-hidden`}>
        <ImagesSidebar
          starNames={starNamesWithImages}
          tags={allTags}
          selectedStarNames={selectedStarNames}
          selectedTags={selectedTags}
          selectedLogic={selectedLogic} // Pass down the selected logic state
          onStarNameChange={handleStarNameChange}
          onTagChange={handleTagChange}
          onLogicChange={handleLogicChange} // Pass down the logic change handler
        />
      </div>
      <div className='flex-1'>
        <div className='w-full flex justify-between px-2'>
          <button onClick={toggleSidebar} className='p-2 text-black text-[30px]'>
            ◧
          </button>
          <div id='layouts' className='w-[30px] h-full flex items-center justify-center'>
            <button><TfiLayoutGrid4Alt className='text-[30px]' /></button>
            <button><TfiLayoutGrid3Alt className='text-[26px]' /></button>
          </div>
        </div>
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
          {loading &&
            <div className='w-full flex justify-center py-5'>
              <div className="loader"></div>
            </div>}
          {!loading && !hasMore && images.length > 0 && <div className='no-more-data'>No more images found.</div>}
          {!loading && images.length === 0 && <div className='no-images'>No images found.</div>}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {!loading && filteredImages.length > pageSize && (
              <Pagination
                showSizeChanger
                onShowSizeChange={handlePageSizeChange}
                onChange={handlePageChange}
                current={page}
                total={filteredImages.length}
                pageSize={pageSize}
                pageSizeOptions={['20', '50', '100', '200']}
              />
            )}
          </div>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
};

export default Images;
