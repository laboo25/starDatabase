import React, { useState, useEffect } from 'react';
import './modalAlbum.css';

const ModalAlbum = ({ visible, albumname, length, images, onClose }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [starnameFilters, setStarnameFilters] = useState({});
  const [tagFilters, setTagFilters] = useState({});

  useEffect(() => {
    const uniqueStarnames = [...new Set(images.map(image => image.starname))];
    const initialStarnameFilters = uniqueStarnames.reduce((acc, starname) => {
      acc[starname] = false;
      return acc;
    }, {});
    setStarnameFilters(initialStarnameFilters);
  }, [images]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleStarnameChange = (starname) => {
    setStarnameFilters(prev => ({ ...prev, [starname]: !prev[starname] }));
  };

  const handleTagChange = (tag) => {
    setTagFilters(prev => ({ ...prev, [tag]: !prev[tag] }));
  };

  const filteredImages = images.filter(image => {
    const matchesStarname = Object.keys(starnameFilters).every(starname => !starnameFilters[starname] || image.starname === starname);
    const matchesTags = Object.keys(tagFilters).every(tag => !tagFilters[tag] || image.tags.includes(tag));
    return matchesStarname && matchesTags;
  });

  if (!visible) return null;

  return (
    <div className='modal-main'>
      <div className={`modal-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div>
          <p>Filter by Starname</p>
          <div>
            {Object.keys(starnameFilters).map(starname => (
              <label key={starname}>
                <input
                  type="checkbox"
                  checked={starnameFilters[starname]}
                  onChange={() => handleStarnameChange(starname)}
                />
                {starname}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p>Filter by Tags</p>
          <div>
            {['tag1', 'tag2', 'tag3'].map(tag => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={tagFilters[tag] || false}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="custom-modal-overlay">
        <div>
          <button onClick={toggleSidebar} className='top-2 left-2'>Open Sidebar</button>
        </div>
        <button className="custom-modal-close" onClick={onClose}>×</button>
        <div className="custom-modal-content">
          <div className='pb-10 text-[20px]'>
            <h3 draggable={false}>{albumname} <span className='text-red-500'>{`x${length}`}</span></h3>
          </div>
          <div className="image-grid card">
            {filteredImages.map((image, index) => (
              <a href={image.imageurl} data-fancybox="gallery" key={index}>
                <img src={image.thumburl} alt={`Album image ${index + 1}`} draggable={false} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAlbum;
