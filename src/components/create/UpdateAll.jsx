import React from 'react';
import { Button, Space, Table, Tag } from 'antd';
const columns = [
    {
        title: 'RowHead',
        dataIndex: 'key',
        rowScope: 'row',
      },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'bio',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'images',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'albums',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button>edit</Button>
        <Button>delete</Button>
      </Space>
    ),
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  }
];
const UpdateAll = () => <Table columns={columns} dataSource={data} />;
export default UpdateAll;