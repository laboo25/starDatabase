import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import './starUpdate.css';

const { Option } = Select;
const { Dragger } = Upload;

const StarUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [fileList, setFileList] = useState({ starprofile: [], starcover: [] });

  useEffect(() => {
    fetchStars();
  }, []);

  const fetchStars = async () => {
    try {
      const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
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
  };

  const onFinish = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('starname', values.starname);

    if (fileList.starprofile.length > 0) {
      formData.append('starprofile', fileList.starprofile[0].originFileObj);
    }

    if (fileList.starcover.length > 0) {
      formData.append('starcover', fileList.starcover[0].originFileObj);
    }

    try {
      const response = await axios.put(
        `https://stardb-api.onrender.com/api/stars/create-star/update-star/${selectedStar._id}`,
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
      fetchStars(); // Refresh stars list
    } catch (error) {
      console.error('Update failed', error);
      message.error('Update failed. Please try again.');
    }

    setLoading(false);
  };

  const handleFileChange = (info, type) => {
    setFileList({ ...fileList, [type]: info.fileList });
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
        <Form.Item
          name="starprofile"
          label="Profile Image"
        >
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
        <Form.Item
          name="starcover"
          label="Cover Image"
        >
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
        <Form.Item>
          <Button className='bg-blue-600 w-full' type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StarUpdate;
