// Create.js
import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './create.css';
import CreateStar from './CreateStar';
import CreateStarBio from './CreateStarBio';
import CreateImages from './CreateImages';
import CreateAlbums from './CreateAlbums';

const Create = () => {
  return (
    <div id="create">
        <BrowserRouter>
      <div id="sidebar">
        <div id="sidebar-title">
          <h2>Create Items</h2>
        </div>
        <NavLink to="create-star" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Create Star
        </NavLink>
        <NavLink to="create-star-bio" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Create Star Bio
        </NavLink>
        <NavLink to="create-images" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Create Images
        </NavLink>
        <NavLink to="create-albums" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Create Albums
        </NavLink>
      </div>

      <div id="forms">
        
        <Routes>
          <Route path="create-star" element={<CreateStar />} />
          <Route path="create-star-bio" element={<CreateStarBio />} />
          <Route path="create-images" element={<CreateImages />} />
          <Route path="create-albums" element={<CreateAlbums />} />
        </Routes>
        
        
      </div>
      </BrowserRouter>
    </div>
  );
};

export default Create;
