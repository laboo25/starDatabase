import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import category from '../../category.json';

const { Option } = Select;
const { Dragger } = Upload;

const CreateAlbums = () => {
    const [stars, setStars] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [form] = Form.useForm();
    const [tags] = useState(category.tags || []);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await axios.get('star-database-api.vercel.app/api/stars/create-star/get-all-star');
                const sortedStars = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
                setStars(sortedStars);
            } catch (error) {
                message.error('Failed to fetch stars');
            }
        };
        fetchStars();
    }, []);

    const onFinish = async (values) => {
        const formData = new FormData();

        // Sort files by name in ascending order
        const sortedFiles = values.albums.sort((a, b) => a.name.localeCompare(b.name));
        sortedFiles.forEach(file => {
            formData.append('albums', file.originFileObj);
        });

        formData.append('albumname', values.albumname);

        if (values.starname) {
            values.starname.forEach(star => formData.append('starname', star));
        }
        if (values.tags) {
            values.tags.forEach(tag => formData.append('tags', tag));
        }

        setUploading(true);

        try {
            await axios.post('star-database-api.vercel.app/api/stars/albums/create-album', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            message.success('Album created and files uploaded successfully');
            form.resetFields();
        } catch (error) {
            console.error('Upload Error:', error.response ? error.response.data : error.message);
            message.error('Failed to create album or upload files');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <div>
                <Form.Item
                    name="albumname"
                    label="Album Name"
                    rules={[{ required: true, message: 'Please input the album name!' }]}
                >
                    <Input placeholder="Enter album name" allowClear />
                </Form.Item>
            </div>
            <div>
                <Form.Item
                    name="starname"
                    label="Star Name(s)"
                >
                    <Select
                        mode="multiple"
                        placeholder="Select star names (optional)"
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {stars.map(star => (
                            <Option key={star._id} value={star._id}>
                                {star.starname}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div>
                <Form.Item
                    name="tags"
                    label="Tags"
                >
                    <Select
                        mode="tags"
                        placeholder="Enter tags (optional)"
                        options={tags.map(tag => ({ value: tag, label: tag })).sort((a, b) => a.label.localeCompare(b.label))}
                    />
                </Form.Item>
            </div>
            <div>
                <Form.Item
                    name="albums"
                    label="Upload Images"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    rules={[{ required: true, message: 'Please upload images!' }]}
                >
                    <Dragger
                        beforeUpload={() => false}
                        multiple
                        accept="image/*"
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for multiple file upload.</p>
                    </Dragger>
                </Form.Item>
                {uploading && (
                    <Progress percent={uploadProgress} />
                )}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full bg-blue-500' disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Create Album'}
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default CreateAlbums;
