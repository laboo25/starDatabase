import React, { useEffect, useState } from 'react';
import './modalAlbum.css';
import axios from 'axios';
import { Select, Input, Modal, Button } from 'antd'; // Import Select and Input components from Ant Design
import category from '../../category.json';
import { HiDotsVertical } from "react-icons/hi";

const { Option } = Select;

const ModalAlbum = ({ visible, albumname, length, images, onClose, albumId, sortField, sortOrder }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [starnames, setStarnames] = useState([]);
  const [starnameFilters, setStarnameFilters] = useState({});
  const [tagFilters, setTagFilters] = useState({});
  const [tags, setTags] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [editTagsModalVisible, setEditTagsModalVisible] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [editAlbumModalVisible, setEditAlbumModalVisible] = useState(false); // State for edit album modal
  const [editAlbumname, setEditAlbumname] = useState(albumname); // State to store edited album name
  const [editStarname, setEditStarname] = useState(images[selectedImageIndex]?.starname || []); // State to store edited star names

  useEffect(() => {
    const fetchStarnamesAndTags = async () => {
      try {
        const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
        const fetchedStarnames = response.data.map(star => star.starname).sort();
        setStarnames(fetchedStarnames);

        const fetchedTags = images.reduce((acc, image) => {
          image.tags.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []).sort();
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

  const toggleImageOptions = (index) => {
    setSelectedImageIndex(index === selectedImageIndex ? null : index);
  };

  const openEditTagsModal = (tags) => {
    setCurrentTags(tags);
    setNewTags(tags);
    setEditTagsModalVisible(true);
  };

  const saveTags = async () => {
    if (!albumId || selectedImageIndex === null) {
      console.error('Album ID or selected image index is undefined');
      return;
    }
    try {
      const updatedImages = [...images];
      updatedImages[selectedImageIndex].tags = newTags.sort();

      await axios.put(`https://stardb-api.onrender.com/api/stars/albums/update/${albumId}`, {
        albumname,
        starname: updatedImages[selectedImageIndex].starname,
        albumimages: updatedImages
      });

      setEditTagsModalVisible(false);
      setTags([...new Set(newTags)].sort());
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const handleEditAlbumname = () => {
    setEditAlbumModalVisible(true);
  };

  const handleEditAlbum = async () => {
    try {
      // Perform API call to update albumname and starname[] here
      console.log('Updated albumname:', editAlbumname);
      console.log('Updated starname:', editStarname);

      // Close modal after updating
      setEditAlbumModalVisible(false);
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const handleCancelEditAlbum = () => {
    setEditAlbumModalVisible(false);
  };

  const handleAlbumnameChange = (e) => {
    setEditAlbumname(e.target.value);
  };

  const handleStarnameSelectChange = (value) => {
    setEditStarname(value);
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
            <span><button onClick={handleEditAlbumname}>edit</button></span>
          </div>
          <div className="image-grid card">
            {filteredImages.map((image, index) => (
              <div key={index} className='relative'>
                <a href={image.imageurl} data-fancybox="gallery">
                  <img src={image.thumburl} alt={`Album image ${index + 1}`} draggable={false} />
                </a>
                <div className='w-full min-h-[30px] pt-2'>
                  <ul className='flex gap-2'>
                    {image.tags.sort().map((tag, idx) => (
                      <li className='hover:text-[blue] cursor-default text-black' key={idx}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <div className='edit-modal absolute bottom-0 right-0'>
                  <button className='edit-btn' onClick={() => toggleImageOptions(index)}><HiDotsVertical /></button>
                  {selectedImageIndex === index && (
                    <div className="options-menu">
                      <button className='edit-tags' onClick={() => openEditTagsModal(image.tags)}>Edit</button>
                      <button>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editTagsModalVisible && (
        <div className="edit-tags-modal">
          <h2>Edit Tags</h2>
          <div className="modal-content">
            <Select
              mode="multiple"
              value={newTags}
              onChange={setNewTags}
              style={{ width: '100%' }}
              placeholder="Select tags"
              className='w-full'
            >
              {Array.isArray(category.tags) && category.tags.sort().map((tag, index) => (
                <Option key={index} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
            <div className='buttons'>
              <Button type="primary" className='bg-blue-500' onClick={saveTags}>Save</Button>
              <Button type="primary" className='bg-blue-500' onClick={() => setEditTagsModalVisible(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        title="Edit Album"
        open={editAlbumModalVisible}
        onOk={handleEditAlbum}
        onCancel={handleCancelEditAlbum}
      >
        <Input value={editAlbumname} onChange={handleAlbumnameChange} />
        <Select
          mode="multiple"
          value={editStarname}
          onChange={handleStarnameSelectChange}
          style={{ width: '100%' }}
          placeholder="Select star names"
        >
          {starnames.map((starname, index) => (
            <Option key={index} value={starname}>
              {starname}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ModalAlbum;
