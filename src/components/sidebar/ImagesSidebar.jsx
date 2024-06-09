import React from 'react';
import { Checkbox, Divider } from 'antd';

const { Group: CheckboxGroup } = Checkbox;

const ImagesSidebar = ({ starNames, tags, selectedStarNames, selectedTags, onStarNameChange, onTagChange }) => {
  const [starNamesIndeterminate, setStarNamesIndeterminate] = React.useState(false);
  const [starNamesCheckAll, setStarNamesCheckAll] = React.useState(false);
  const [tagsIndeterminate, setTagsIndeterminate] = React.useState(false);
  const [tagsCheckAll, setTagsCheckAll] = React.useState(false);

  const onCheckAllStarNamesChange = (e) => {
    setStarNamesCheckAll(e.target.checked);
    setStarNamesIndeterminate(false);
    onStarNameChange(e.target.checked ? starNames : []);
  };

  const onStarNameChangeInternal = (checkedList) => {
    setStarNamesIndeterminate(!!checkedList.length && checkedList.length < starNames.length);
    setStarNamesCheckAll(checkedList.length === starNames.length);
    onStarNameChange(checkedList);
  };

  const onCheckAllTagsChange = (e) => {
    setTagsCheckAll(e.target.checked);
    setTagsIndeterminate(false);
    onTagChange(e.target.checked ? tags : []);
  };

  const onTagChangeInternal = (checkedList) => {
    setTagsIndeterminate(!!checkedList.length && checkedList.length < tags.length);
    setTagsCheckAll(checkedList.length === tags.length);
    onTagChange(checkedList);
  };

  return (
    <div>
      <div>
        <h3>Filter</h3>
      </div>
      <div>
        <div>
          <p>Filter by star name</p>
          <div>
            <Checkbox indeterminate={starNamesIndeterminate} onChange={onCheckAllStarNamesChange} checked={starNamesCheckAll}>
              Check all
            </Checkbox>
            <Divider />
            <CheckboxGroup options={starNames} value={selectedStarNames} onChange={onStarNameChangeInternal} />
          </div>
        </div>
        <div>
          <p>Filter by tags</p>
          <div>
            <Checkbox indeterminate={tagsIndeterminate} onChange={onCheckAllTagsChange} checked={tagsCheckAll}>
              Check all
            </Checkbox>
            <Divider />
            <CheckboxGroup options={tags} value={selectedTags} onChange={onTagChangeInternal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesSidebar;
