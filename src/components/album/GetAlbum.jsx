import React, { useEffect, useState } from 'react';
import ModalAlbum from './ModalAlbum';
import './getAlbum.css';
import { Pagination } from 'antd';
import axiosInstance from '../../app/axiosInstance';  // Import the axios instance

const GetAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [sortedAlbums, setSortedAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(localStorage.getItem('modalVisible') === 'true');
  const [sortField, setSortField] = useState('date'); // 'date' or 'name'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Set default page size to 50

  useEffect(() => {
    axiosInstance.get('/stars/albums/get-all-albums')
      .then(response => {
        setAlbums(response.data);
        setSortedAlbums(response.data);
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

  useEffect(() => {
    sortAlbums();
  }, [sortField, sortOrder, albums]);

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

  const sortAlbums = () => {
    const sorted = [...albums].sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.albumname.localeCompare(b.albumname)
          : b.albumname.localeCompare(a.albumname);
      } else {
        return sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setSortedAlbums(sorted);
  };

  const toggleSortField = () => {
    setSortField(prev => (prev === 'date' ? 'name' : 'date'));
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedAlbums = sortedAlbums.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div id='getAlbum' className=''>
      <div className='text-[#dfdfdf] text-[10px]'>{`${sortedAlbums.length} albums available`}</div>
      <div className='mb-4'>
        <button onClick={toggleSortField} className='px-4 py-2 bg-blue-500 text-white rounded'>
          {sortField === 'date' ? 'name' : 'date'}
        </button>
        <button onClick={toggleSortOrder} className='ml-2 px-4 py-2 bg-blue-500 text-white rounded'>
          {sortOrder === 'asc' ? 'a↑' : 'z↓'}
        </button>
      </div>
      {sortedAlbums.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div id='wrapper' className='w-full flex py-10 flex-wrap'>
          {paginatedAlbums.map(album => (
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
      <Pagination
        showSizeChanger
        onShowSizeChange={handlePageChange}
        onChange={handlePageChange}
        defaultCurrent={currentPage}
        total={sortedAlbums.length}
        pageSize={pageSize}
      />
      {selectedAlbum && (
        <ModalAlbum 
          visible={isModalVisible} 
          albumname={selectedAlbum.albumname} 
          length={selectedAlbum.albumimages.length} 
          images={selectedAlbum.albumimages} 
          onClose={closeModal}
          albumId={selectedAlbum._id}  // Pass albumId here
          sortField={sortField}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default GetAlbum;
