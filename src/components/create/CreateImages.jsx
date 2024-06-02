import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Option } = Select;

const CreateImages = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchStars();
  }, []);

  const fetchStars = async () => {
    try {
      const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
      const sortStar = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
      setStars(sortStar);
    } catch (error) {
      console.error('Error fetching stars:', error);
      message.error('Failed to fetch stars. Please try again.');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    if (values.starId) formData.append('starname', values.starId);
    if (values.subfolder) formData.append('subfolder', values.subfolder);
    if (values.tags && values.tags.length > 0) formData.append('tags', values.tags.join(','));

    if (fileList.length > 0) {
      fileList.forEach((file) => {
        formData.append('images', file.originFileObj);
      });
    }

    try {
      const response = await axios.post(
        'http://localhost:1769/api/stars/images/create-star-images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload success:', response.data);
      message.success('Images uploaded successfully');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Upload failed. Please try again.');
    }

    setLoading(false);
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <div>
      <h2>Upload Images</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="starId" label="Star ID">
          <Select placeholder="Select a star">
            {stars.map((star) => (
              <Option key={star._id} value={star._id}>
                {star.starname}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="subfolder" label="Subfolder">
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select mode="multiple" placeholder="Select tags">
            <Option value="nature">Nature</Option>
            <Option value="sea">Sea</Option>
            <Option value="city">City</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
          rules={[{ required: true, message: 'Please select images' }]}
        >
          <Dragger
            name="images"
            multiple={true}
            fileList={fileList}
            beforeUpload={() => false} // prevent automatic upload
            onChange={handleFileChange}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Form.Item>
        <Form.Item>
          <Button className='bg-blue-600 w-full'  type="primary" htmlType="submit" loading={loading}>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateImages;
