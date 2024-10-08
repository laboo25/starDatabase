import React, { useEffect, useState } from 'react';
import './modalAlbum.css';
import category from '../../category.json'
import axiosInstance from '../../app/axiosInstance';
import { Select, Input, Modal, Button, Upload, Progress, message } from 'antd';
import { HiDotsVertical } from "react-icons/hi";

const { Option } = Select;
const { Dragger } = Upload;

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
  const [editAlbumModalVisible, setEditAlbumModalVisible] = useState(false);
  const [editAlbumname, setEditAlbumname] = useState(albumname);
  const [editStarname, setEditStarname] = useState(images[selectedImageIndex]?.starname || []);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchStarnamesAndTags = async () => {
      try {
        const response = await axiosInstance.get('/stars/create-star/get-all-star');
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

      await axiosInstance.put(`/stars/albums/update/${albumId}`, {
        albumname,
        starname: updatedImages[selectedImageIndex].starname,
        albumimages: updatedImages
      });

      setEditTagsModalVisible(false);
      setTags([...new Set(newTags)].sort());
    } catch (error) {
      console.error('Error saving tags:', error);
      message.error('Failed to save tags.');
    }
  };

  const handleEditAlbumname = () => {
    setEditAlbumModalVisible(true);
  };

  const handleEditAlbum = async () => {
    try {
      const formData = new FormData();
      formData.append('albumname', editAlbumname);
      formData.append('starname', JSON.stringify(editStarname));

      fileList.forEach(file => {
        formData.append('albumimages', file.originFileObj);
      });

      const response = await axiosInstance.put(`/stars/albums/update/${albumId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded / total) * 100);
          setUploadProgress(percent);
        }
      });

      if (response.status === 200) {
        message.success('Album updated successfully!');
        onClose();  // Close the modal after a successful update
      } else {
        message.error('Failed to update album.');
      }
    } catch (error) {
      console.error('Error updating album:', error.response?.data || error.message);
      message.error('Failed to update album.');
    } finally {
      setUploadProgress(0);
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

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleDeleteImage = async (imageId) => {
    if (!imageId) {
      console.error('Image ID is undefined');
      return;
    }

    try {
      console.log(`Deleting image with ID: ${imageId}`);
      await axiosInstance.delete(`/stars/albums/delete-album/${albumId}/${imageId}`);
      message.success('Image deleted successfully');
      onClose();  // Optionally, refresh or update the images list
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Failed to delete image');
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumId) {
      console.error('Album ID is undefined');
      return;
    }

    try {
      await axiosInstance.delete(`/stars/albums/delete-album/${albumId}`);
      message.success('Album deleted successfully');
      onClose();  // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting album:', error);
      message.error('Failed to delete album');
    }
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
          <div>
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
            <span><button onClick={handleEditAlbumname}>edit</button><button onClick={handleDeleteAlbum}>delete album</button></span>
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
                      <li className=' cursor-default text-black text-[12px]' key={idx}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <div className='edit-modal absolute bottom-3 right-2'>
                  <button onClick={() => toggleImageOptions(index)} className='p-2 rounded-md shadow-inner-[10px] shadow-black inline-block bg-red-600'>
                    <HiDotsVertical />
                  </button>
                  {selectedImageIndex === index && (
                    <div className='absolute bottom-0 right-5 bg-[#ccc] p-2 rounded'>
                      <button onClick={() => openEditTagsModal(image.tags)}>edit</button>
                      <button onClick={() => handleDeleteImage(image.imageId)}>delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Editing Album Name */}
      <Modal
        title="Edit Album"
        open={editAlbumModalVisible}
        onOk={handleEditAlbum}
        onCancel={handleCancelEditAlbum}
        okText="Save"
        cancelText="Cancel"
      >
        <Input placeholder="Enter album name" value={editAlbumname} onChange={handleAlbumnameChange} />
        <Select
          mode="tags"
          style={{ width: '100%', marginTop: '20px' }}
          placeholder="Select starnames"
          value={editStarname}
          onChange={handleStarnameSelectChange}
        >
          {starnames.map(starname => (
            <Option key={starname} value={starname}>{starname}</Option>
          ))}
        </Select>
        <Dragger
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleUploadChange}
          multiple={true}
          listType="picture"
        >
          <p className="ant-upload-drag-icon">
            <img src="https://via.placeholder.com/80" alt="upload" />
          </p>
          <p className="ant-upload-text">Drag & Drop images here or click to upload</p>
        </Dragger>
        {uploadProgress > 0 && <Progress percent={uploadProgress} />}
      </Modal>

      {/* Modal for Editing Tags */}
      <Modal
        title="Edit Tags"
        open={editTagsModalVisible}
        onOk={saveTags}
        onCancel={() => setEditTagsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Enter tags"
          value={newTags}
          onChange={setNewTags}
        >
          {tags.map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ModalAlbum;
