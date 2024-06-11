import React, { useState, useEffect } from 'react';
import './modalAlbum.css';
import axios from 'axios';

const ModalAlbum = ({ visible, albumname, length, images, onClose }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [starnames, setStarnames] = useState([]);
  const [starnameFilters, setStarnameFilters] = useState({});
  const [tagFilters, setTagFilters] = useState({});
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchStarnamesAndTags = async () => {
      try {
        const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
        const fetchedStarnames = response.data.map(star => star.starname);
        setStarnames(fetchedStarnames);
  
        // Extracting tags from images
        const fetchedTags = images.reduce((acc, image) => {
          image.tags.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []);
        setTags(fetchedTags);
  
        const initialStarnameFilters = fetchedStarnames.reduce((acc, starname) => {
          acc[starname] = false;
          return acc;
        }, {});
        setStarnameFilters(initialStarnameFilters);
      } catch (error) {
        console.error('Error fetching starnames and tags:', error);
      }
    };
  
    fetchStarnamesAndTags();
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
        <div id='filter-option'>
          <div id=''>
            <p>Filter by Tags</p>
            <div id='tags-wrapper'>
              {tags.map(tag => (
                <div key={tag}>
                  <input type="checkbox" checked={tagFilters[tag] || false} onChange={() => handleTagChange(tag)} id={`tag-${tag}`} />
                  <label htmlFor={`tag-${tag}`}>{tag} [{tag.length}]</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="custom-modal-overlay">
        <div>
          <button onClick={toggleSidebar} className='top-2 left-2 pl-6 text-[30px]'>◧</button>
        </div>
        <button className="custom-modal-close" onClick={onClose}>×</button>
        <div className="custom-modal-content">
          <div className='pb-10 text-[20px]'>
            <h3 draggable={false}>{albumname} <span className='text-red-500'>{`x${length}`}</span></h3>
          </div>
          <div className="image-grid card">
            {filteredImages.map((image, index) => (
              <div key={index}>
                <a href={image.imageurl} data-fancybox="gallery">
                  <img src={image.thumburl} alt={`Album image ${index + 1}`} draggable={false} />
                </a>
                <div>
                  <ul>
                    {image.tags.map((tag, idx) => (
                      <li key={idx}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAlbum;
