import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select, Progress } from 'antd';
import { UploadOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const MAX_CONCURRENT_UPLOADS = 5; // Set concurrency limit

const CreateAlbums = () => {
    const [stars, setStars] = useState([]);
    const [uploadQueue, setUploadQueue] = useState([]);
    const [ongoingUploads, setOngoingUploads] = useState(0);
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

    const onFinish = (values) => {
        const formData = new FormData();
        formData.append('albumname', values.albumname);
        if (values.starname) {
            values.starname.forEach(star => formData.append('starname', star));
        }
        if (values.tags) {
            values.tags.forEach(tag => formData.append('tags', tag));
        }
        if (values.albums) {
            const files = values.albums.map(file => ({
                file: file.originFileObj,
                status: 'pending',
                progress: 0,
            }));
            setUploadQueue(files);
        }
    };

    const uploadFile = async (fileData, index) => {
        const formData = new FormData();
        formData.append('albums', fileData.file);
        setUploadQueue(prevQueue => {
            const newQueue = [...prevQueue];
            newQueue[index].status = 'uploading';
            return newQueue;
        });
        setOngoingUploads(prev => prev + 1);

        try {
            await axios.post('https://stardb-api.onrender.com/api/stars/albums/create-album', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadQueue(prevQueue => {
                        const newQueue = [...prevQueue];
                        newQueue[index].progress = percentCompleted;
                        return newQueue;
                    });
                }
            });
            setUploadQueue(prevQueue => {
                const newQueue = [...prevQueue];
                newQueue[index].status = 'done';
                return newQueue;
            });
            message.success('File uploaded successfully');
        } catch (error) {
            setUploadQueue(prevQueue => {
                const newQueue = [...prevQueue];
                newQueue[index].status = 'error';
                return newQueue;
            });
            message.error('Failed to upload file');
        } finally {
            setOngoingUploads(prev => prev - 1);
            processQueue(); // Trigger next upload if any
        }
    };

    const processQueue = () => {
        if (ongoingUploads < MAX_CONCURRENT_UPLOADS) {
            const nextIndex = uploadQueue.findIndex(file => file.status === 'pending');
            if (nextIndex !== -1) {
                uploadFile(uploadQueue[nextIndex], nextIndex);
            }
        }
    };

    useEffect(() => {
        processQueue();
    }, [uploadQueue, ongoingUploads]);

    const handleRetry = (index) => {
        setUploadQueue(prevQueue => {
            const newQueue = [...prevQueue];
            newQueue[index].status = 'pending';
            return newQueue;
        });
        processQueue(); // Trigger next upload if any
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <div>
                <Form.Item
                    name="albumname"
                    label="Album Name"
                    rules={[{ required: true, message: 'Please input the album name!' }]}
                >
                    <Input placeholder="Enter album name" allowClear/>
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
                {uploadQueue.map((fileData, index) => (
                    <div key={index}>
                        <Progress percent={fileData.progress} />
                        {fileData.status === 'error' && (
                            <Button icon={<RedoOutlined />} onClick={() => handleRetry(index)}>
                                Retry
                            </Button>
                        )}
                    </div>
                ))}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-full bg-blue-500' disabled={ongoingUploads > 0}>
                        {ongoingUploads > 0 ? 'Uploading...' : 'Create Album'}
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default CreateAlbums;
