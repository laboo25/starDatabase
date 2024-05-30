import React, { useState, useEffect } from 'react';
import './createStar.css';
import { Upload, message, Button, Input, Form, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axiosInstance from '../../app/axiosInstance';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';

const { Dragger } = Upload;

const CreateStar = () => {
  const [starname, setStarname] = useState('');
  const [starcover, setStarcover] = useState([]);
  const [starprofile, setStarprofile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const uppy = new Uppy({
    autoProceed: false,
    restrictions: {
      maxNumberOfFiles: 1,
    },
  });

  uppy.use(XHRUpload, {
    endpoint: 'https://stardb-api.onrender.com/api/stars/create-star/create-new-star',
    fieldName: 'files',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onProgress: (progress) => {
      setUploadPercentage(progress);
    },
  });

  useEffect(() => {
    uppy.on('complete', (result) => {
      setLoading(false);
      if (result.successful) {
        message.success('Star created successfully');
        setStarname('');
        setStarcover([]);
        setStarprofile([]);
        setUploadPercentage(0);
      } else {
        message.error('Error creating star');
      }
    });

    return () => uppy.close();
  }, [uppy]);

  const handleCoverChange = ({ file, fileList }) => {
    setStarcover(fileList);
    return false; // Prevent automatic upload
  };

  const handleProfileChange = ({ file, fileList }) => {
    setStarprofile(fileList);
    return false; // Prevent automatic upload
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('starname', values.starname);
    if (starcover.length > 0) formData.append('starcover', starcover[0].originFileObj);
    if (starprofile.length > 0) formData.append('starprofile', starprofile[0].originFileObj);

    try {
      await axiosInstance.post('/stars/create-star/create-new-star', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercentage(percentCompleted);
        },
      });
      message.success('Star created successfully');
      setStarname('');
      setStarcover([]);
      setStarprofile([]);
      setUploadPercentage(0);
    } catch (error) {
      console.error('Error creating star:', error.response ? error.response.data : error.message);
      message.error('Error creating star');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className='title'>Create Star</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Star Name"
          name="starname"
          rules={[{ required: true, message: 'Please input the star name!' }]}
        >
          <Input value={starname} onChange={(e) => setStarname(e.target.value)} allowClear className='title-input'/>
        </Form.Item>
        <Form.Item
          label="Star Cover"
          name="starcover"
        >
          <Dragger
            fileList={starcover}
            beforeUpload={handleCoverChange}
            onRemove={() => setStarcover([])}
            className='cover-input'
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single upload.</p>
          </Dragger>
        </Form.Item>
        <Form.Item
          label="Star Profile"
          name="starprofile"
        >
          <Dragger
            fileList={starprofile}
            beforeUpload={handleProfileChange}
            onRemove={() => setStarprofile([])}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single upload.</p>
          </Dragger>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Star
        </Button>
      </Form>
      {uploadPercentage > 0 && <Progress percent={uploadPercentage} />}
    </div>
  );
};

export default CreateStar;
