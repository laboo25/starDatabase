// components/Sidebar.js
import React from 'react';

const Sidebar = ({ tags, tagFilters, handleTagChange, sidebarOpen, toggleSidebar }) => {
  return (
    <div className={`modal-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div id='filter-option'>
        <div>
          <p>Filter by Tags</p>
          <div id='tags-wrapper'>
            {tags.map(tag => (
              <div key={tag}>
                <input type="checkbox" checked={tagFilters[tag] || false} onChange={() => handleTagChange(tag)} id={`tag-${tag}`} />
                <label htmlFor={`tag-${tag}`}>{tag} [{tag.length}]</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={toggleSidebar} className='top-2 left-2 pl-6 text-[30px]'>◧</button>
    </div>
  );
};

export default Sidebar;
