import React, { useEffect, useState } from 'react';
import ModalAlbum from './ModalAlbum';
import './getAlbum.css';

const GetAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [sortedAlbums, setSortedAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(localStorage.getItem('modalVisible') === 'true');
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    fetch('https://stardb-api.onrender.com/api/stars/albums/get-all-albums')
      .then(response => response.json())
      .then(data => {
        setAlbums(data);
        setSortedAlbums(data);
      })
      .catch(error => console.error('Error fetching albums:', error));
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (isModalVisible) {
        closeModal();
        event.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isModalVisible]);

  const openModal = (album) => {
    setSelectedAlbum(album);
    setIsModalVisible(true);
    document.body.style.overflow = 'hidden';
    window.history.pushState({ modalOpen: true }, '');
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedAlbum(null);
    document.body.style.overflow = 'auto';
    window.history.back();
  };

  const toggleSorting = () => {
    if (isSorted) {
      setSortedAlbums(albums);
    } else {
      const sorted = [...albums].sort((a, b) => a.albumname.localeCompare(b.albumname));
      setSortedAlbums(sorted);
    }
    setIsSorted(!isSorted);
  };

  return (
    <div id='getAlbum' className=''>
      <div className='text-[#dfdfdf] text-[10px]'>{`${sortedAlbums.length} albums available`}</div>
      <button onClick={toggleSorting} className='mb-4 px-4 py-2 bg-blue-500 text-white rounded'>
        {isSorted ? 'Date ⇅' : 'Name ⇅'}
      </button>
      {sortedAlbums.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div id='wrapper' className='w-full flex py-10 flex-wrap'>
          {sortedAlbums.map(album => (
            <div key={album._id} className='album-container'>
              {album.albumimages.length > 0 && (
                <div className='w-full aspect-video' onClick={() => openModal(album)}>
                  <img 
                    src={album.albumimages[0].thumburl} 
                    alt={album.albumname} 
                    draggable={false}
                    className='w-full h-full object-cover cursor-pointer' 
                  />
                </div>
              )}
              <p>{album.albumname}</p>
            </div>
          ))}
        </div>
      )}
      {selectedAlbum && (
        <ModalAlbum 
          visible={isModalVisible} 
          albumname={selectedAlbum.albumname} 
          length={selectedAlbum.albumimages.length} 
          images={selectedAlbum.albumimages} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default GetAlbum;
