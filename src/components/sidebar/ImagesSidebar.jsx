import React from 'react';

const ImagesSidebar = ({ starNames, tags, selectedStarNames, selectedTags, selectedLogic, onStarNameChange, onTagChange, onLogicChange }) => {
  const [starNamesIndeterminate, setStarNamesIndeterminate] = React.useState(false);
  const [starNamesCheckAll, setStarNamesCheckAll] = React.useState(false);
  const [tagsIndeterminate, setTagsIndeterminate] = React.useState(false);
  const [tagsCheckAll, setTagsCheckAll] = React.useState(false);

  const onCheckAllStarNamesChange = (e) => {
    const checked = e.target.checked;
    setStarNamesCheckAll(checked);
    setStarNamesIndeterminate(false);
    onStarNameChange(checked ? starNames : []);
  };

  const onStarNameChangeInternal = (e) => {
    const checkedList = [...selectedStarNames];
    const value = e.target.value;
    if (e.target.checked) {
      checkedList.push(value);
    } else {
      const index = checkedList.indexOf(value);
      if (index > -1) {
        checkedList.splice(index, 1);
      }
    }
    setStarNamesIndeterminate(!!checkedList.length && checkedList.length < starNames.length);
    setStarNamesCheckAll(checkedList.length === starNames.length);
    onStarNameChange(checkedList);
  };

  const onCheckAllTagsChange = (e) => {
    const checked = e.target.checked;
    setTagsCheckAll(checked);
    setTagsIndeterminate(false);
    onTagChange(checked ? tags : []);
  };

  const onTagChangeInternal = (e) => {
    const checkedList = [...selectedTags];
    const value = e.target.value;
    if (e.target.checked) {
      checkedList.push(value);
    } else {
      const index = checkedList.indexOf(value);
      if (index > -1) {
        checkedList.splice(index, 1);
      }
    }
    setTagsIndeterminate(!!checkedList.length && checkedList.length < tags.length);
    setTagsCheckAll(checkedList.length === tags.length);
    onTagChange(checkedList);
  };

  const onLogicChangeInternal = (e) => {
    onLogicChange(e.target.value);
  };

  return (
    <div className='w-full mx-3'>
      <div>
        <h3>Filter</h3>
      </div>
      <div>
        <div>
          <p>Filter by star name</p>
          <div>
            <label>
              <input type="checkbox" onChange={onCheckAllStarNamesChange} checked={starNamesCheckAll} />
              Check all
            </label>
            <hr />
            {starNames.map((starName) => (
              <label key={starName}>
                <input
                  type="checkbox"
                  value={starName}
                  onChange={onStarNameChangeInternal}
                  checked={selectedStarNames.includes(starName)}
                />
                {starName}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p>Filter by tags</p>
          <div>
            <label>
              <input type="checkbox" onChange={onCheckAllTagsChange} checked={tagsCheckAll} />
              Check all
            </label>
            <br />
            <div className='w-full flex justify-start flex-wrap gap-2 overflow-auto'>
              {tags.map((tag) => (
                <label key={tag}>
                  <input
                    type="checkbox"
                    value={tag}
                    onChange={onTagChangeInternal}
                    checked={selectedTags.includes(tag)}
                    className='mx-1'
                  />
                  {tag}
                </label>
              ))}
            </div>
            <div className='w-full flex justify-center gap-[20px] '>
              <label>
                <input
                  type="radio"
                  name="logic"
                  value="AND"
                  checked={selectedLogic === 'AND'}
                  onChange={onLogicChangeInternal}
                  className='mx-2'
                />
                AND
              </label>
              <label>
                <input
                  type="radio"
                  name="logic"
                  value="OR"
                  checked={selectedLogic === 'OR'}
                  onChange={onLogicChangeInternal}
                  className='mx-2'
                />
                OR
              </label>
              <label>
                <input
                  type="radio"
                  name="logic"
                  value="NOT"
                  checked={selectedLogic === 'NOT'}
                  onChange={onLogicChangeInternal}
                  className='mx-2'
                />
                NOT
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesSidebar;
