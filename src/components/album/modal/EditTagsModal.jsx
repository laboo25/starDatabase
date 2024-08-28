import React from 'react';
import { Modal, Select } from 'antd';

const { Option } = Select;

const EditTagsModal = ({
  editTagsModalVisible,
  saveTags,
  setEditTagsModalVisible,
  newTags,
  setNewTags,
  tags,
}) => {
  return (
    <Modal
      title="Edit Tags"
      open={editTagsModalVisible}
      onOk={saveTags}
      onCancel={() => setEditTagsModalVisible(false)}
      okText="Save"
      cancelText="Cancel"
    >
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Enter tags"
        value={newTags}
        onChange={setNewTags}
      >
        {tags.map(tag => (
          <Option key={tag} value={tag}>{tag}</Option>
        ))}
      </Select>
    </Modal>
  );
};

export default EditTagsModal;
