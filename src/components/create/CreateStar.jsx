import React, { useState } from 'react';
import { Modal, message, Button, Input, Form, Progress, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import ImageCropper from './ImageCropper';

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

  const handleCrop = (blob, type) => {
    const croppedFile = new File([blob], currentFile.name, { type: currentFile.type });
    if (type === 'starcover') {
      setStarcover([{ ...starcover[0], originFileObj: croppedFile }]);
      setIsCoverModalVisible(false);
    } else if (type === 'starprofile') {
      setStarprofile([{ ...starprofile[0], originFileObj: croppedFile }]);
      setIsProfileModalVisible(false);
    }
    const preview = URL.createObjectURL(croppedFile);
    setPreviewImage(preview);
  };

  const handleCancel = (type) => {
    if (type === 'starcover') {
      setIsCoverModalVisible(false);
      setStarcover([]);
    } else if (type === 'starprofile') {
      setIsProfileModalVisible(false);
      setStarprofile([]);
    }
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
      formData.append('starcover', starcover[0].originFileObj || starcover[0]);
    }
    if (starprofile.length > 0) {
      formData.append('starprofile', starprofile[0].originFileObj || starprofile[0]);
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
        onCancel={() => handleCancel('starcover')}
        onCrop={(blob) => handleCrop(blob, 'starcover')}
        aspectRatio={16 / 9} // Aspect ratio for cover image
      />
      <ImageCropper
        visible={isProfileModalVisible}
        image={previewImage}
        onCancel={() => handleCancel('starprofile')}
        onCrop={(blob) => handleCrop(blob, 'starprofile')}
        aspectRatio={2 / 3} // Aspect ratio for profile image
      />
    </div>
  );
};

export default CreateStar;
