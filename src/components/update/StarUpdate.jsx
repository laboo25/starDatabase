import React, { useState, useEffect } from 'react';
import './starUpdate.css';
import { Form, Input, Button, Select, Upload, message, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import ImageCropper from '../create/ImageCropper';

const { Dragger } = Upload;
const { Option } = Select;

const StarUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [fileList, setFileList] = useState({ starprofile: [], starcover: [] });
  const [cropData, setCropData] = useState({ starprofile: null, starcover: null });
  const [cropImage, setCropImage] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isCoverModalVisible, setIsCoverModalVisible] = useState(false);

  useEffect(() => {
    fetchStars();
  }, []);

  useEffect(() => {
    return () => {
      if (cropImage) {
        URL.revokeObjectURL(cropImage); // Revoke the object URL on cleanup
      }
    };
  }, [cropImage]);

  const fetchStars = async () => {
    try {
      const response = await axios.get('https://stardb-api.vercel.app/api/stars/create-star/get-all-star');
      const sortedStars = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
      setStars(sortedStars);
    } catch (error) {
      console.error('Error fetching stars', error);
      message.error('Failed to fetch stars. Please try again.');
    }
  };

  const onStarChange = (starId) => {
    const star = stars.find(star => star._id === starId);
    setSelectedStar(star);
    form.setFieldsValue({ starname: star.starname });
    setFileList({ starprofile: [], starcover: [] });
    setCropData({ starprofile: null, starcover: null });
  };

  const onFinish = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('starname', values.starname);

    if (fileList.starcover.length > 0 && cropData.starcover) {
      formData.append('starcover', cropData.starcover);
    }

    if (fileList.starprofile.length > 0 && cropData.starprofile) {
      formData.append('starprofile', cropData.starprofile);
    }

    try {
      const response = await axios.put(
        `https://stardb-api.vercel.app/api/stars/create-star/update-star/${selectedStar._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Update success', response.data);
      message.success('Star updated successfully');
      form.resetFields();
      setFileList({ starprofile: [], starcover: [] });
      setCropData({ starprofile: null, starcover: null });
      fetchStars(); // Refresh stars list
    } catch (error) {
      console.error('Update failed', error);
      message.error('Update failed. Please try again.');
    }

    setLoading(false);
  };

  const handleFileChange = (info, type) => {
    const updatedFileList = info.fileList.map((file) => ({
      ...file,
      uid: file.uid || file.name, // Ensure each file has a unique `uid`
    }));
    setFileList({ ...fileList, [type]: updatedFileList });
    if (info.fileList.length > 0) {
      const objectUrl = URL.createObjectURL(info.fileList[0].originFileObj);
      setCropImage(objectUrl);
      if (type === 'starcover') {
        setIsCoverModalVisible(true);
      } else {
        setIsProfileModalVisible(true);
      }
    }
  };

  const handleCrop = (blob, type) => {
    const file = new File([blob], `${type}.png`, { type: 'image/png' });
    setCropData({ ...cropData, [type]: file });
    if (type === 'starcover') {
      setIsCoverModalVisible(false);
    } else {
      setIsProfileModalVisible(false);
    }
    URL.revokeObjectURL(cropImage); // Revoke the object URL after cropping
    setCropImage(null);
  };

  const handleCancel = (type) => {
    if (type === 'starcover') {
      setIsCoverModalVisible(false);
    } else {
      setIsProfileModalVisible(false);
    }
    URL.revokeObjectURL(cropImage); // Revoke the object URL when canceling
    setCropImage(null);
  };

  return (
    <div id='starupdate-main'>
      <h2>Update Star</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="starId"
          label="Select Star"
          rules={[{ required: true, message: 'Please select a star' }]}
        >
          <Select
            showSearch
            placeholder="Select a star"
            optionFilterProp="children"
            onChange={onStarChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {stars.map((star) => (
              <Option key={star._id} value={star._id}>
                {star.starname}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="starname"
          label="Star Name"
          rules={[{ required: true, message: 'Please input the star name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="starcover" label="Cover Image">
          <Dragger
            name="starcover"
            fileList={fileList.starcover}
            beforeUpload={() => false} // prevent automatic upload
            onChange={(info) => handleFileChange(info, 'starcover')}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
        </Form.Item>
        <Form.Item name="starprofile" label="Profile Image">
          <Dragger
            name="starprofile"
            fileList={fileList.starprofile}
            beforeUpload={() => false} // prevent automatic upload
            onChange={(info) => handleFileChange(info, 'starprofile')}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
        </Form.Item>
        <Form.Item>
          <Button className='bg-blue-600 w-full' type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
      <ImageCropper
        visible={isCoverModalVisible}
        image={cropImage}
        onCancel={() => handleCancel('starcover')}
        onCrop={(blob) => handleCrop(blob, 'starcover')}
        aspectRatio={16 / 9} // Aspect ratio for cover image
      />
      <ImageCropper
        visible={isProfileModalVisible}
        image={cropImage}
        onCancel={() => handleCancel('starprofile')}
        onCrop={(blob) => handleCrop(blob, 'starprofile')}
        aspectRatio={2 / 3} // Aspect ratio for profile image
      />
    </div>
  );
};

export default StarUpdate;
