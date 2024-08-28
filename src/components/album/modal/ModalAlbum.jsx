import React, { useEffect, useState } from 'react';
import './modalAlbum.css';
import axiosInstance from '../../../app/axiosInstance';
import { message } from 'antd';
import Sidebar from './Sidebar';
import ImageGrid from './ImageGrid';
import EditAlbumModal from './EditAlbumModal';
import EditTagsModal from './EditTagsModal';
import categoryData from '../../../category.json'; 

const ModalAlbum = ({ visible, albumname, length, images, onClose, albumId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [starnames, setStarnames] = useState([]);
  const [starnameFilters, setStarnameFilters] = useState({});
  const [tagFilters, setTagFilters] = useState({});
  const [tags, setTags] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [editTagsModalVisible, setEditTagsModalVisible] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const [editAlbumModalVisible, setEditAlbumModalVisible] = useState(false);
  const [editAlbumname, setEditAlbumname] = useState(albumname);
  const [editStarname, setEditStarname] = useState(images[0]?.starname || []);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchStarnamesAndTags = async () => {
      try {
        const response = await axiosInstance.get('/stars/create-star/get-all-star');
        const fetchedStarnames = response.data.map(star => star.starname).sort();
        setStarnames(fetchedStarnames);

        const fetchedTagsFromImages = images.reduce((acc, image) => {
          image.tags.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []);

        const fetchedTags = Array.from(new Set([...fetchedTagsFromImages, ...categoryData.tags])).sort();
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

  const handleTagChange = (tag) => {
    setTagFilters(prev => ({ ...prev, [tag]: !prev[tag] }));
  };

  const toggleImageOptions = (index) => {
    setSelectedImageIndex(index === selectedImageIndex ? null : index);
    setEditStarname(images[index]?.starname || []);
  };

  const openEditTagsModal = (tags) => {
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

      // API call to update the tags for the selected image
      await axiosInstance.put(`/stars/albums/update-image-tags/${albumId}/${updatedImages[selectedImageIndex]._id}`, {
        tags: updatedImages[selectedImageIndex].tags
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

  const handleDeleteImage = async (imageId) => {
    if (!imageId) {
      console.error('Image ID is undefined');
      return;
    }

    try {
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
    const matchesTags = Object.keys(tagFilters).every(tag => !tagFilters[tag] || image.tags.includes(tag));
    return matchesTags;
  });

  if (!visible) return null;

  return (
    <div className='modal-main'>
      <Sidebar
        tags={tags}
        tagFilters={tagFilters}
        handleTagChange={handleTagChange}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="custom-modal-overlay">
        <button className="custom-modal-close" onClick={onClose}>&times;</button>
        <div className="custom-modal-content">
          <div className='pb-10 text-[20px]'>
            <h3 draggable={false}>{albumname} <span className='text-red-500'>{`x${length}`}</span></h3>
            <span><button onClick={handleEditAlbumname}>edit</button><button onClick={handleDeleteAlbum}>delete album</button></span>
          </div>
          <ImageGrid
            filteredImages={filteredImages}
            toggleImageOptions={toggleImageOptions}
            selectedImageIndex={selectedImageIndex}
            openEditTagsModal={openEditTagsModal}
            handleDeleteImage={handleDeleteImage}
          />
        </div>
      </div>

      <EditAlbumModal
        editAlbumModalVisible={editAlbumModalVisible}
        handleEditAlbum={handleEditAlbum}
        handleCancelEditAlbum={handleCancelEditAlbum}
        editAlbumname={editAlbumname}
        handleAlbumnameChange={setEditAlbumname}
        editStarname={editStarname}
        handleStarnameSelectChange={setEditStarname}
        starnames={starnames}
        fileList={fileList}
        handleUploadChange={setFileList}
        uploadProgress={uploadProgress}
      />

      <EditTagsModal
        editTagsModalVisible={editTagsModalVisible}
        saveTags={saveTags}
        setEditTagsModalVisible={setEditTagsModalVisible}
        newTags={newTags}
        setNewTags={setNewTags}
        tags={tags}
      />
    </div>
  );
};

export default ModalAlbum;
