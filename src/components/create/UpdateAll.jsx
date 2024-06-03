import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input } from 'antd';
import axios from 'axios';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import avater from '/avater.webp';
import { Link } from 'react-router-dom';

const { Search } = Input;

// Function to capitalize the first letter of each word
const capitalize = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

const columns = [
  {
    title: 'RowHead',
    dataIndex: 'key',
    rowScope: 'row',
  },
  {
    title: 'profile',
    dataIndex: 'profile',
    key: 'profile',
    render: (profile) => profile ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />,
  },
  {
    title: 'Avatar',
    dataIndex: 'cover',
    key: 'cover',
    render: (cover) => <img src={cover || avater} alt="cover" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/star/${record._id}`} >{text}</Link>,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  
  {
    title: 'Bio',
    dataIndex: 'bio',
    key: 'bio',
    render: (bio) => bio ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />,
  },
  {
    title: 'Images',
    dataIndex: 'images',
    key: 'images',
    render: (images) => images.length > 0 ? images.length : <CloseCircleOutlined style={{ color: 'red' }} />,
  },
  {
    title: 'Albums',
    dataIndex: 'albums',
    key: 'albums',
    render: (albums) => albums.length > 0 ? albums.length : <CloseCircleOutlined style={{ color: 'red' }} />,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button disabled>delete</Button>
      </Space>
    ),
  },
];

const UpdateAll = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
        const stars = response.data.map((star, index) => ({
          key: index + 1,
          name: capitalize(star.starname),
          _id: star._id,
          cover: star.starcover,
          profile: star.starprofile,
          bio: star.starbio,
          images: star.starImages || [],
          albums: star.starAlbums || [],
        }));
        stars.sort((a, b) => a.name.localeCompare(b.name)); // Sort data in ascending order by default
        setData(stars);
        setFilteredData(stars);
      } catch (error) {
        console.error('Error fetching star data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = data.filter(star =>
      star.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <div className='overflow-x-auto'>
        <Search
          placeholder="Search star name"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <div className="max-h-600px overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="key"
            pagination={{ defaultPageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
            defaultSortOrder={{ order: 'ascend', columnKey: 'name' }} // Set default sort order
            onChange={(pagination, filters, sorter) => {
              if (sorter.order === 'ascend') {
                setFilteredData([...filteredData].sort((a, b) => a.name.localeCompare(b.name)));
              } else if (sorter.order === 'descend') {
                setFilteredData([...filteredData].sort((a, b) => b.name.localeCompare(a.name)));
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UpdateAll;
