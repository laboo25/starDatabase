import React, { useState, useEffect } from 'react';
// import './createAlbum.css';
import { Upload, message, Button, Input, Select, Progress } from 'antd';
import { InboxOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../app/axiosInstance'; // Import axios instance

const { Dragger } = Upload;
const { Option } = Select;

const CreateAlbums = () => {
  const [albumname, setAlbumname] = useState('');
  const [starname, setStarname] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [starOptions, setStarOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch star names from the API
    axiosInstance.get('/stars/create-star/get-all-star')
      .then(response => {
        const sortedStars = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
        setStarOptions(sortedStars);
      })
      .catch(error => {
        console.error('Error fetching the star names:', error);
        message.error('Error fetching the star names');
      });
  }, []);

  const handleStarnameChange = (value) => {
    setStarname(value);
  };

  const handleTagChange = (value) => {
    setTags(value);
  };

  const handleUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadPercentage(percentCompleted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('albumname', albumname);
    starname.forEach(name => {
      formData.append('starname', name);
    });
    fileList.forEach(file => {
      formData.append('files', file.originFileObj);
    });
    tags.forEach(tag => {
      formData.append('tags', tag);
    });

    try {
      const response = await axiosInstance.post('/stars/albums/create-album', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: handleUploadProgress
      });
      console.log(response.data);
      setUploadMessage('Album created successfully');
      message.success('Album created successfully');
      // Mark files as uploaded
      setFileList(fileList.map(file => ({ ...file, uploaded: true })));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUploadMessage('Unauthorized. Please log in.');
        message.error('Unauthorized. Please log in.');
      } else {
        console.error('Error creating album:', error.response?.data);
        setUploadMessage('Error creating album');
        message.error('Error creating album');
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList: fileList,
    beforeUpload: (file) => {
      setFileList(prevFiles => [...prevFiles, { ...file, originFileObj: file }]);
      return false; // Prevent automatic upload
    },
    onRemove: (file) => {
      setFileList(prevFiles => prevFiles.filter(f => f.uid !== file.uid));
    },
  };

  return (
    <div>
      <h2 className='title'>Create Album</h2>
      {uploadMessage && <p>{uploadMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="albumname">Album Name:</label>
          <Input type="text" id="albumname" value={albumname} onChange={(e) => setAlbumname(e.target.value)} className='title-input' />
        </div>
        <div>
          <label htmlFor="starname">Star Name: {starname.length}</label>
          <Select
            id="starname"
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            onChange={handleStarnameChange}
          >
            {starOptions.map(star => (
              <Option key={star._id} value={star.starname}>{star.starname}</Option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="tags">Tags:</label>
          <Select
            id="tags"
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            onChange={handleTagChange}
          >
            <Option value="Tag1">Tag1</Option>
            <Option value="Tag2">Tag2</Option>
            {/* Add other options dynamically based on your data */}
          </Select>
        </div>
        <div>
          <label htmlFor="files">Select Images:</label>
          <Dragger {...uploadProps} className='cover-input'>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Dragger>
        </div>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Album
        </Button>
      </form>
      {uploadPercentage > 0 && <Progress percent={uploadPercentage} />}
      <div className='uploaded-images'>
        {fileList.map((file, index) => (
          <div key={index} className='uploaded-image-wrapper'>
            {file.originFileObj && (
              <>
                <img
                  src={URL.createObjectURL(file.originFileObj)}
                  alt={file.name}
                  className={`uploaded-image ${file.uploaded ? 'uploaded-image-overlay' : ''}`}
                />
                {file.uploaded && (
                  <CheckCircleOutlined className='uploaded-image-ok' />
                )}
                <Button
                  type="text"
                  
                  className='submit-btn'
                  onClick={() => setFileList(prevFiles => prevFiles.filter(f => f.uid !== file.uid))}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateAlbums;
