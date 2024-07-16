import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Button, Input, Form, Progress, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import ImageCropper from './ImageCropper';
import imageCompression from 'browser-image-compression';

const { Dragger } = Upload;

const CreateStar = () => {
  const [starname, setStarname] = useState('');
  const [starcover, setStarcover] = useState([]);
  const [starprofile, setStarprofile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [previewImage, setPreviewImage] = useState('');
  const [isCoverModalVisible, setIsCoverModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [croppingType, setCroppingType] = useState('');
  const [starExists, setStarExists] = useState(false);
  const [checkingStarname, setCheckingStarname] = useState(false);

  const handleCoverChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];
      setCurrentFile(file);
      setCroppingType('cover');
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setIsCoverModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
    setStarcover(fileList);
  };

  const handleProfileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];
      setCurrentFile(file);
      setCroppingType('profile');
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setIsProfileModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
    setStarprofile(fileList);
  };

  const handleCrop = async (blob, type) => {
    const file = new File([blob], currentFile.name, { type: currentFile.type });

    let options;
    if (type === 'cover') {
      options = {
        maxSizeMB: 0.017,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
    } else if (type === 'profile') {
      options = {
        maxSizeMB: 0.09,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
    }

    try {
      const compressedFile = await imageCompression(file, options);
      if (type === 'cover') {
        setStarcover([{ ...starcover[0], originFileObj: compressedFile }]);
        setIsCoverModalVisible(false);
      } else if (type === 'profile') {
        setStarprofile([{ ...starprofile[0], originFileObj: compressedFile }]);
        setIsProfileModalVisible(false);
      }
      const preview = URL.createObjectURL(compressedFile);
      setPreviewImage(preview);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const handleCancel = (type) => {
    if (type === 'cover') {
      setIsCoverModalVisible(false);
      setStarcover([]);
    } else if (type === 'profile') {
      setIsProfileModalVisible(false);
      setStarprofile([]);
    }
  };

  const checkStarExists = async (name) => {
    try {
      setCheckingStarname(true);
      const response = await axios.get('star-database-api.vercel.app/api/stars/create-star/get-all-star');
      const stars = response.data;
      const exists = stars.some((star) => star.starname.toLowerCase() === name.toLowerCase());
      setStarExists(exists);
    } catch (error) {
      console.error('Error checking star existence:', error.response ? error.response.data : error.message);
    } finally {
      setCheckingStarname(false);
    }
  };

  useEffect(() => {
    if (starname) {
      const delayDebounceFn = setTimeout(() => {
        checkStarExists(starname);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setStarExists(false);
    }
  }, [starname]);

  const handleSubmit = async () => {
    if (!starname) {
      message.error('Please input the star name');
      return;
    }

    if (starExists) {
      message.error('This star already exists');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('starname', starname);
    if (starcover.length > 0) {
      formData.append('starcover', starcover[0].originFileObj || starcover[0]);
    }
    if (starprofile.length > 0) {
      formData.append('starprofile', starprofile[0].originFileObj || starprofile[0]);
    }

    console.log('Form Data:', formData);

    try {
      const response = await axios.post('star-database-api.vercel.app/api/stars/create-star/create-new-star', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercentage(percentCompleted);
        },
      });

      console.log('Response:', response);

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
            <Input 
              value={starname} 
              onChange={(e) => setStarname(e.target.value)} 
              allowClear 
              className='title-input' 
              status={starExists ? 'warning' : ''}
              placeholder={starExists ? 'This star already exists' : ''}
            />
          </Form.Item>
        </div>
        <div className='py-3'>
          <Form.Item
            label="Star Cover"
            name="starcover"
          >
            <Dragger
              fileList={starcover}
              beforeUpload={() => false}
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
              beforeUpload={() => false}
              onChange={handleProfileChange}
              onRemove={() => setStarprofile([])}
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
        <Button className='bg-blue-600 w-full' type="primary" htmlType="submit" loading={loading}>
          Create Star
        </Button>
      </Form>
      {uploadPercentage > 0 && <Progress percent={uploadPercentage} />}
      <ImageCropper
        visible={isCoverModalVisible}
        image={previewImage}
        onCancel={() => handleCancel('cover')}
        onCrop={(blob) => handleCrop(blob, 'cover')}
        aspectRatio={16 / 9} // Aspect ratio for cover image
      />
      <ImageCropper
        visible={isProfileModalVisible}
        image={previewImage}
        onCancel={() => handleCancel('profile')}
        onCrop={(blob) => handleCrop(blob, 'profile')}
        aspectRatio={2 / 3} // Aspect ratio for profile image
      />
    </div>
  );
};

export default CreateStar;
