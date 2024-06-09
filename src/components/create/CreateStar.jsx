import React, { useState } from 'react';
import './createStar.css';
import { Upload, message, Button, Input, Form, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

const CreateStar = () => {
  const [starname, setStarname] = useState('');
  const [starcover, setStarcover] = useState([]);
  const [starprofile, setStarprofile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleCoverChange = ({ fileList }) => {
    setStarcover(fileList);
  };

  const handleProfileChange = ({ fileList }) => {
    setStarprofile(fileList);
  };

  const handleSubmit = async () => {
    if (!starname) {
      message.error('Please input the star name');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('starname', starname);
    if (starcover.length > 0) {
      formData.append('starcover', starcover[0].originFileObj);
    }
    if (starprofile.length > 0) {
      formData.append('starprofile', starprofile[0].originFileObj);
    }

    try {
      await axios.post('https://stardb-api.onrender.com/api/stars/create-star/create-new-star', formData, {
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
        <div className='py-3'>
          <Form.Item
            label="Star Name"
            name="starname"
            rules={[{ required: true, message: 'Please input the star name!' }]}
          >
            <Input value={starname} onChange={(e) => setStarname(e.target.value)} allowClear className='title-input' />
          </Form.Item>
        </div>
        <div className='py-3'>
          <Form.Item
            label="Star Cover"
            name="starcover"
          >
            <Dragger
              fileList={starcover}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleCoverChange}
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
        </div>
        <div className='py-3'>
          <Form.Item
            label="Star Profile"
            name="starprofile"
          >
            <Dragger
              fileList={starprofile}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleProfileChange}
              onRemove={() => setStarprofile([])}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single upload.</p>
            </Dragger>
          </Form.Item>
        </div>
        <Button className='bg-blue-600 w-full' type="primary" htmlType="submit" loading={loading}>
          Create Star
        </Button>
      </Form>
      {uploadPercentage > 0 && <Progress percent={uploadPercentage} />}
    </div>
  );
};

export default CreateStar;