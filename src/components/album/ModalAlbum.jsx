import React, { useEffect, useState } from 'react';
import './modalAlbum.css';
import axiosInstance from '../../app/axiosInstance';
import { Select, Input, Modal, Button, Upload, Progress, message, Popconfirm } from 'antd';
import category from '../../category.json';
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
      message.success('Tags updated successfully!');
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
      formData.append('starname', JSON.stringify(editStarname));  // Ensure this is an array of IDs

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

  const deleteImage = async (index) => {
    try {
      const updatedImages = images.filter((_, i) => i !== index);

      await axiosInstance.put(`/stars/albums/update/${albumId}`, {
        albumname,
        albumimages: updatedImages,
      });

      message.success('Image deleted successfully!');
      setSelectedImageIndex(null);  // Reset the selected image index
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Failed to delete image.');
    }
  };

  const deleteAlbum = async () => {
    try {
      await axiosInstance.delete(`/stars/albums/delete-album/${albumId}`);
      message.success('Album deleted successfully!');
      onClose();  // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting album:', error);
      message.error('Failed to delete album.');
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
            <span>
              <button onClick={handleEditAlbumname}>Edit</button>
              <Popconfirm
                title="Are you sure you want to delete this album?"
                onConfirm={deleteAlbum}
                okText="Yes"
                cancelText="No"
              >
                <button>Delete Album</button>
              </Popconfirm>
            </span>
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
                <div className='edit-modal absolute bottom-[-20px] right-0'>
                  <button className='edit-btn' onClick={() => toggleImageOptions(index)}><HiDotsVertical /></button>
                  {selectedImageIndex === index && (
                    <div className="options-menu">
                      <button className='edit-tags' onClick={() => openEditTagsModal(image.tags)}>Edit</button>
                      <Popconfirm
                        title="Are you sure you want to delete this image?"
                        onConfirm={() => deleteImage(index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button>Delete</button>
                      </Popconfirm>
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
        onCancel={handleCancelEditAlbum}
        footer={[
          <Button key="cancel" onClick={handleCancelEditAlbum}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleEditAlbum}>Save</Button>
        ]}
      >
        <Input
          placeholder="Album Name"
          value={editAlbumname}
          onChange={handleAlbumnameChange}
          style={{ marginBottom: '20px' }}
        />
        <Select
          mode="multiple"
          placeholder="Select Starname"
          value={editStarname}
          onChange={handleStarnameSelectChange}
          style={{ marginBottom: '20px', width: '100%' }}
        >
          {starnames.map((starname, index) => (
            <Option key={index} value={starname}>{starname}</Option>
          ))}
        </Select>
        <Dragger
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleUploadChange}
          multiple
        >
          <p className="ant-upload-drag-icon">
            <i className="fa fa-cloud-upload"></i>
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Dragger>
        {uploadProgress > 0 && <Progress percent={uploadProgress} />}
      </Modal>
    </div>
  );
};

export default ModalAlbum;
