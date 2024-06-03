import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input } from 'antd';
import axios from 'axios';
import avater from '../../../public/avater.webp'
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
    title: 'Avatar',
    dataIndex: 'cover',
    key: 'cover',
    render: (cover) => <img src={cover || avater} alt="cover" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.name.localeCompare(b.name),
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
          cover: star.starcover,
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
      <Search
        placeholder="Search star name"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        allowClear
      />
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="index" 
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
    </>
  );
};

export default UpdateAll;
