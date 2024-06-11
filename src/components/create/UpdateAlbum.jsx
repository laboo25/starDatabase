import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, Table, Popconfirm } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UpdateAlbum = () => {
    const [stars, setStars] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchStars();
        fetchAlbums();
    }, []);

    const fetchStars = async () => {
        try {
            const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
            setStars(response.data.stars);
        } catch (error) {
            message.error('Failed to fetch stars');
        }
    };

    const fetchAlbums = async () => {
        try {
            const response = await axios.get('https://stardb-api.onrender.com/api/stars/albums/get-all-albums');
            setAlbums(response.data.albums);
        } catch (error) {
            message.error('Failed to fetch albums');
        }
    };

    const onFinish = async (values) => {
        try {
            await axios.put(`https://stardb-api.onrender.com/api/stars/albums/update/${selectedAlbum._id}`, values);
            message.success('Album updated successfully');
            fetchAlbums();
            form.resetFields();
            setSelectedAlbum(null);
        } catch (error) {
            message.error('Failed to update album');
        }
    };

    const deleteAlbum = async (albumId) => {
        try {
            await axios.delete(`https://stardb-api.onrender.com/api/stars/albums/delete-album/${albumId}`);
            message.success('Album deleted successfully');
            fetchAlbums();
        } catch (error) {
            message.error('Failed to delete album');
        }
    };

    const columns = [
        { title: 'Album Name', dataIndex: 'albumname', key: 'albumname' },
        { title: 'Star Names', dataIndex: 'starname', key: 'starname', render: starname => starname.map(star => star.name).join(', ') },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button type="link" onClick={() => setSelectedAlbum(record)}>Edit</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteAlbum(record._id)}>
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    useEffect(() => {
        if (selectedAlbum) {
            form.setFieldsValue({
                albumname: selectedAlbum.albumname,
                starname: selectedAlbum.starname.map(star => star._id),
                albumimages: selectedAlbum.albumimages
            });
        }
    }, [selectedAlbum, form]);

    return (
        <div style={{ padding: '24px' }}>
            <h1>Manage Albums</h1>
            <Table columns={columns} dataSource={albums} rowKey="_id" />
            {selectedAlbum && (
                <Form form={form} onFinish={onFinish} layout="vertical" style={{ marginTop: '24px' }}>
                    <Form.Item name="albumname" label="Album Name" rules={[{ required: true, message: 'Please input the album name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="starname" label="Star Names" rules={[{ required: true, message: 'Please select the star names!' }]}>
                        <Select mode="multiple">
                            {stars.map(star => (
                                <Option key={star._id} value={star._id}>{star.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {/* Add more fields as necessary */}
                    <Form.List name="albumimages">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'imageurl']}
                                            fieldKey={[fieldKey, 'imageurl']}
                                            rules={[{ required: true, message: 'Missing image URL' }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Input placeholder="Image URL" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'thumburl']}
                                            fieldKey={[fieldKey, 'thumburl']}
                                            rules={[{ required: true, message: 'Missing thumbnail URL' }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Input placeholder="Thumbnail URL" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'tags']}
                                            fieldKey={[fieldKey, 'tags']}
                                            style={{ flex: 2 }}
                                        >
                                            <Select mode="tags" placeholder="Tags" />
                                        </Form.Item>
                                        <Button type="link" onClick={() => remove(name)} danger>Remove</Button>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add Image
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Update Album</Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default UpdateAlbum;
