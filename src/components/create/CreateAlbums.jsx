import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { Dragger } = Upload;

const CreateAlbums = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [stars, setStars] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch all stars to populate the starname dropdown
    axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star')
      .then(response => {
        const sortedStars = response.data
          .filter(star => star.starname) // Ensure each star has a starname property
          .sort((a, b) => a.starname.localeCompare(b.starname));
        setStars(sortedStars);
      })
      .catch(error => {
        console.error('There was an error fetching the stars!', error);
      });
  }, []);

  const handleUpload = (info) => {
    let files = [...info.fileList];
    // Limit the number of uploaded files
    files = files.slice(-100); 
    // Assign the state to fileList
    setFileList(files);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('albumname', values.albumname);
    
    values.starname.forEach(star => formData.append('starname', star));
    if (values.tags) {
      values.tags.forEach(tag => formData.append('tags', tag));
    }

    fileList.forEach((file) => {
      formData.append('albums', file.originFileObj);
    });

    setUploading(true);
    
    try {
      const response = await axios.post('http://localhost:1769/api/stars/albums/create-album', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(percentCompleted);
        },
      });
      message.success('Album created successfully!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('There was an error creating the album!', error);
      message.error('Failed to create album');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="albumname" label="Album Name" rules={[{ required: true, message: 'Please input the album name!' }]}>
        <Input />
      </Form.Item>
      
      <Form.Item name="starname" label="Star Name(s)" rules={[{ required: true, message: 'Please select star(s)!' }]}>
        <Select
          mode="multiple"
          placeholder="Select star(s)"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showSearch
        >
          {stars.map(star => (
            <Option key={star._id} value={star._id}>{star.starname}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="tags" label="Tags">
        <Select mode="tags" placeholder="Add tags">
          {['tag1', 'tag2'].map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Upload Images">
        <Dragger
          fileList={fileList}
          multiple={true}
          beforeUpload={() => false}
          onChange={handleUpload}
          listType="picture"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Dragger>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading}>
          {uploading ? 'Uploading' : 'Create Album'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAlbums;
