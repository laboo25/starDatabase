import React, { useEffect, useState } from 'react';
import ModalAlbum from './modal/ModalAlbum';
import './getAlbum.css';
import { Pagination } from 'antd';
import axiosInstance from '../../app/axiosInstance'; // Import the axios instance
import Search from 'antd/es/input/Search';

const GetAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [sortedAlbums, setSortedAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]); // New state for filtered albums
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(localStorage.getItem('modalVisible') === 'true');
  const [sortField, setSortField] = useState('name'); // Default to sorting by name
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Define pageSize state with a default value
  const [loading, setLoading] = useState(JSON.parse(sessionStorage.getItem('loading')) || true); 
// albums fetching
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axiosInstance.get('/stars/albums/get-all-albums');
        setAlbums(response.data);
        setSortedAlbums(response.data);
        setFilteredAlbums(response.data); // Initialize filteredAlbums with all albums
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
        sessionStorage.setItem('loading', false); // Store the loading state in sessionStorage
      }
    };

    fetchAlbums();
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
    setFilteredAlbums(sorted); // Ensure the filtered list is also sorted
  };

  const toggleSortField = () => {
    setSortField(prev => (prev === 'name' ? 'date' : 'name'));
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize); // Update pageSize state when it changes
  };

  const onSearch = (value) => {
    const filtered = sortedAlbums.filter(album => 
      album.albumname.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAlbums(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const paginatedAlbums = filteredAlbums.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div id='getAlbum'>
      <div><Search placeholder="Search album name" onSearch={onSearch} enterButton /></div>
      <div className='text-[#dfdfdf] text-[10px]'>{`${filteredAlbums.length} albums available`}</div>
      <div className='mb-4'>
        <button onClick={toggleSortField} className='px-3 py-1 bg-[#5f5f5f2f] text-black rounded font-light text-[14px] shadow-inner'>
          {sortField === 'date' ? 'name' : 'date'}
        </button>
        <button onClick={toggleSortOrder} className='ml-2 px-3 py-1 bg-[#5f5f5f2f] text-black rounded font-light text-[14px] shadow-inner'>
          {sortOrder === 'asc' ? 'a↑' : 'z↓'}
        </button>
      </div>
      {loading ? (
        <div className='w-full h-screen absolute top-0 left-0 z-10 flex justify-center items-center'>
          <div className="loader">
          </div>
        </div>
      ) : (
        <>
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
                <p className='text-[13px] pt-1'>{album.albumname}</p>
              </div>
            ))}
          </div>
          <div className='w-full h-auto flex justify-center py-14'>
            <Pagination
              showSizeChanger
              onShowSizeChange={handlePageChange}
              onChange={handlePageChange}
              current={currentPage}
              pageSize={pageSize} // Use the pageSize state here
              total={filteredAlbums.length}
              pageSizeOptions={['10', '20', '50', '100']} // Add page size options
            />
          </div>
        </>
      )}
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
