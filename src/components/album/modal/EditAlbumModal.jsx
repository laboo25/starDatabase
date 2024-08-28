import React from 'react';
import { Modal, Input, Select, Upload, Progress } from 'antd';

const { Option } = Select;
const { Dragger } = Upload;

const EditAlbumModal = ({
  editAlbumModalVisible,
  handleEditAlbum,
  handleCancelEditAlbum,
  editAlbumname,
  handleAlbumnameChange,
  editStarname,
  handleStarnameSelectChange,
  starnames,
  fileList,
  handleUploadChange,
  uploadProgress,
}) => {
  return (
    <Modal
      title="Edit Album"
      open={editAlbumModalVisible}
      onOk={handleEditAlbum}
      onCancel={handleCancelEditAlbum}
      okText="Save"
      cancelText="Cancel"
    >
      <Input
        placeholder="Enter album name"
        value={editAlbumname}
        onChange={(e) => handleAlbumnameChange(e.target.value)}
      />
      <Select
        mode="tags"
        style={{ width: '100%', marginTop: '20px' }}
        placeholder="Select starnames"
        value={editStarname}
        onChange={handleStarnameSelectChange}
      >
        {starnames.map(starname => (
          <Option key={starname} value={starname}>{starname}</Option>
        ))}
      </Select>
      <Dragger
        fileList={fileList}
        beforeUpload={() => false}
        onChange={(info) => handleUploadChange(info.fileList)}
        multiple={true}
        listType="picture"
      >
        <p className="ant-upload-drag-icon">
          <img src="https://via.placeholder.com/80" alt="upload" />
        </p>
        <p className="ant-upload-text">Drag & Drop images here or click to upload</p>
      </Dragger>
      {uploadProgress > 0 && <Progress percent={uploadProgress} />}
    </Modal>
  );
};

export default EditAlbumModal;
