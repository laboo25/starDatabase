import React, { useState } from 'react';
import { Upload, message, Button, Input, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Option } = Select;

const CreateAlbums = () => {
  const [albumname, setAlbumname] = useState('');
  const [starname, setStarname] = useState([]);
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleFileChange = (fileList) => {
    setFiles([...files, ...fileList]);
  };

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
    const formData = new FormData();
    formData.append('albumname', albumname);
    starname.forEach(name => {
      formData.append('starname', name);
    });
    files.forEach(file => {
      formData.append('files', file);
    });
    tags.forEach(tag => {
      formData.append('tags', tag);
    });

    try {
      const response = await axios.post('https://stardb-api.onrender.com/api/stars/albums/create-album', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: handleUploadProgress
      });
      console.log(response.data);
      setMessage('Album created successfully');
    } catch (error) {
      console.error('Error creating album:', error.response.data);
      setMessage('Error creating album');
    }
  };

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://stardb-api.onrender.com/api/stars/albums/create-album', // Change this to your upload endpoint
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <h2>Create Album</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="albumname">Album Name:</label>
          <Input type="text" id="albumname" value={albumname} onChange={(e) => setAlbumname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="starname">Star Name:</label>
          <Select
            id="starname"
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            onChange={handleStarnameChange}
          >
            <Option value="Star1">Star1</Option>
            <Option value="Star2">Star2</Option>
            {/* Add other options dynamically based on your data */}
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
          <Dragger {...props} onChange={(info) => handleFileChange(info.fileList)}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Dragger>
        </div>
        <Button type="primary" htmlType="submit">
          Create Album
        </Button>
      </form>
      {uploadPercentage > 0 && <p>Upload Progress: {uploadPercentage}%</p>}
      <div>
        {files.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
            <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateAlbums;
