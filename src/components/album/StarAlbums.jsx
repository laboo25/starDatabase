import React, { useState, useEffect } from 'react';
import './starAlbum.css';
import axios from 'axios';
import {  Spin, message } from 'antd';
import ModalAlbum from './ModalAlbum';

const StarAlbums = ({ starId }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(localStorage.getItem('modalVisible') === 'true');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, [starId]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (isModalVisible) {
        handleCancel();
        event.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isModalVisible]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('https://stardb-api.onrender.com/api/stars/albums/get-all-albums');
      console.log('API response:', response.data);

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid API response');
      }

      const filteredAlbums = response.data.filter(album => {
        console.log('Album starname:', album.starname);
        return album.starname && album.starname.includes(starId);
      });

      console.log('Filtered albums:', filteredAlbums);
      setAlbums(filteredAlbums);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching albums:', error);
      message.error('Failed to fetch albums. Please try again.');
      setLoading(false);
    }
  };

  const showModal = (album) => {
    setSelectedAlbum(album);
    setIsModalVisible(true);
    document.body.style.overflow = 'hidden';
    window.history.pushState({ modalOpen: true }, '');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAlbum(null);
    document.body.style.overflow = 'auto';
    window.history.back();
  };

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (albums.length === 0) {
    return <div>No albums available.</div>;
  }

  return (
    <div className="album-gallery">
      {albums.map(album => (
        <div key={album._id} id="album-card">
          <div onClick={() => showModal(album)} id='card'>
            <img
              src={album.albumimages[0].thumburl}
              alt={`Thumbnail for ${album.albumname}`}
              draggable={false}
              className=""
            />
          </div>
          <div>
            <p id="album-title" className='py-5' draggable={false}>{album.albumname}</p>
          </div>
        </div>
      ))}
      {selectedAlbum && (
        <ModalAlbum
          visible={isModalVisible}
          albumname={selectedAlbum.albumname}
          length={selectedAlbum.albumimages.length}
          images={selectedAlbum.albumimages}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default StarAlbums;
