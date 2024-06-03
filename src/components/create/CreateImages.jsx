import React, { useState, useEffect } from 'react';
import { Form, Button, message, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Option } = Select;

const CreateImages = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [subfolders, setSubfolders] = useState([
    { label: 'mio', value: 'mio' },
    { label: 'foot', value: 'foot' },
    { label: 'face', value: 'face' },
    { label: 'toy', value: 'toy' },
    { label: 'nude', value: 'nude' },
    { label: 'sesso', value: 'sesso' },
  ]);

  useEffect(() => {
    fetchStars();
  }, []);

  const fetchStars = async () => {
    try {
      const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
      const sortedStars = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
      setStars(sortedStars);
    } catch (error) {
      console.error('Error fetching stars:', error);
      message.error('Failed to fetch stars. Please try again.');
    }
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error('Please select images to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (values.starIds && values.starIds.length > 0) {
      values.starIds.forEach((id) => formData.append('starIds[]', id));
    }
    if (values.subfolder) formData.append('subfolder', values.subfolder);
    if (values.tags && values.tags.length > 0) formData.append('tags', values.tags.join(','));

    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      const response = await axios.post(
        'https://stardb-api.onrender.com/api/stars/images/create-star-images',
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
        <Form.Item name="starIds" label="Stars">
          <Select mode="multiple" placeholder="Select stars">
            {stars.map((star) => (
              <Option key={star._id} value={star._id}>
                {star.starname}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="subfolder"
          label="Subfolder"
          rules={[{ required: true, message: 'Please select a subfolder' }]}
        >
          <Select
            placeholder="Select a subfolder"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {subfolders.map((subfolder) => (
              <Option key={subfolder.value} value={subfolder.value}>
                {subfolder.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select
            mode="multiple"
            placeholder="Select tags"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="mio">mio</Option>
            <Option value="feet">feet</Option>
            <Option value="nude">nude</Option>
            <Option value="face">face</Option>
            <Option value="toy">toy</Option>
            <Option value="sesso">sesso</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
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
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
        </Form.Item>
        <Form.Item>
          <Button className='bg-blue-600 w-full' type="primary" htmlType="submit" loading={loading}>
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateImages;
