import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input, Modal } from 'antd';
import axios from 'axios';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import avater from '/avater.webp';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const { Search } = Input;

// Function to capitalize the first letter of each word
const capitalize = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

const UpdateAll = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: 'RowHead',
      dataIndex: 'key',
      rowScope: 'row',
      size: 20
    },
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      render: (profile) => profile ? <CheckCircleFilled style={{ color: '#0096ff' }} /> : <CloseCircleFilled style={{ color: 'red' }} />,
    },
    {
      title: 'Avatar',
      dataIndex: 'cover',
      key: 'cover',
      render: (cover) => <img src={cover || avater} alt="cover" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />,
    },
    {
      title: 'Name', // Placeholder, will be updated dynamically
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/star/${record._id}`} >{text}</Link>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      render: (bio) => bio ? <CheckCircleFilled style={{ color: '#0096ff' }} /> : <CloseCircleFilled style={{ color: 'red' }} />,
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (images) => images && images.length > 0 ? images.length : <CloseCircleFilled style={{ color: 'red' }} />,
    },
    {
      title: 'Albums',
      dataIndex: 'albums',
      key: 'albums',
      render: (albums) => albums.length > 0 ? albums.length : <CloseCircleFilled style={{ color: 'red' }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showDeleteConfirm(record)}>delete</Button>
        </Space>
      ),
    },
  ]);

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

        // Update the "Name" column title with the length of the star list
        setColumns((prevColumns) =>
          prevColumns.map((column) =>
            column.dataIndex === 'name' ? { ...column, title: `Name (${stars.length})` } : column
          )
        );
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

  const showDeleteConfirm = (record) => {
    setDeleteRecord(record);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      // Make API call to delete the star
      await axios.delete(`https://stardb-api.onrender.com/api/stars/create-star/delete-star/${deleteRecord._id}`);
      // Remove the deleted record from data and filteredData
      const newData = data.filter(item => item._id !== deleteRecord._id);
      setData(newData);
      setFilteredData(newData);
      setIsModalVisible(false);
      setDeleteRecord(null);
    } catch (error) {
      console.error('Error deleting star:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteRecord(null);
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
            pagination={{ defaultPageSize: 25, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
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
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="ok" onClick={handleOk} className="bg-red-500 text-white">
            OK
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete 
          <span style={{ color: 'red' }}> {deleteRecord?.name}</span>?
        </p>
      </Modal>
    </>
  );
};

export default UpdateAll;
