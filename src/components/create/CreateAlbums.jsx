import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const CreateAlbums = () => {
    const [stars, setStars] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
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
        formData.append('albumname', values.albumname);
        if (values.starname) {
            values.starname.forEach(star => formData.append('starname', star));
        }
        if (values.tags) {
            values.tags.forEach(tag => formData.append('tags', tag));
        }
        if (values.albums) {
            values.albums.forEach(file => formData.append('albums', file.originFileObj));
        }

        try {
            const response = await axios.post('https://stardb-api.onrender.com/api/stars/albums/create-album', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success('Album created successfully');
            form.resetFields();
        } catch (error) {
            message.error('Failed to create album');
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
                    <Input placeholder="Enter album name" />
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
                        options={[
                            { value: 'tag1', label: 'tag1' },
                            { value: 'tag3', label: 'tag3' },
                            { value: 'tag2', label: 'tag2' }
                        ].sort((a, b) => a.label.localeCompare(b.label))}
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
                    <Upload
                        listType="picture"
                        beforeUpload={() => false}
                        multiple
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full bg-blue-500'>
                        Create Album
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default CreateAlbums;
