import React, { useState, useEffect } from 'react';
import './create.css';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Create = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarVisible && !event.target.closest('#sidebar') && !event.target.closest('.toggle-btn')) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarVisible]);

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <div id='create'>
        <button className='toggle-btn' onClick={toggleSidebar}>
          {isSidebarVisible ? 'Close' : 'Menu'}
        </button>
        <div id='sidebar' className={isSidebarVisible ? 'visible' : ''}>
          <div>
            <Link to='/' className='text-right'>home</Link>
          </div>
          <h1>Create</h1>
          <Link to='/create' className={getLinkClass('/create')}>create star</Link>
          <Link to='/create/create-bio' className={getLinkClass('/create/create-bio')}>create bio</Link>
          <Link to='/create/create-images' className={getLinkClass('/create/create-images')}>create images</Link>
          <Link to='/create/create-album' className={getLinkClass('/create/create-album')}>create album</Link>
          <Link to='/create/update-all' className={getLinkClass('/create/update-all')}>update all</Link>
          <Link to='/create/update-star' className={getLinkClass('/create/update-star')}>update star⭐</Link>
          
        </div>
        <div id='forms'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Create;
