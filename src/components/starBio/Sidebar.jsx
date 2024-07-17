import React, { useEffect, useState } from 'react';
import './sidebar.css';
import logo from '/meu.svg'
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from 'antd';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [stars, setStars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStars, setFilteredStars] = useState([]);

  useEffect(() => {
    axios.get('https://stardatabase-api-production.up.railway.app/api/stars/create-star/get-all-star')
      .then((res) => {
        const filteredAndSortedStars = res.data
          .filter(star => star.starprofile) // Only include stars with a starprofile image
          .sort((a, b) => a.starname.localeCompare(b.starname)); // Sort by starname in ascending order
        setStars(filteredAndSortedStars);
        setFilteredStars(filteredAndSortedStars);
      })
      .catch((error) => {
        console.error('Error fetching stars:', error);
      });
  }, []);

  useEffect(() => {
    const results = stars.filter(star =>
      star.starname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStars(results);
  }, [searchTerm, stars]);

  return (
    <div id='sidebar-main'>
      <div className='sidebar-content'>
        <div className='w-full h-[60px] flex justify-center items-center'>
          
            <Link to='/'>
              <img src={logo} alt=""  className='w-auto h-[20px]'/>
            </Link>
          
        </div>
        <div className='pb-[10px]'>
          <Input
            placeholder="Search Star"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>
      </div>
      <div className='list-wrapper'>
        <div className='list'>
          {filteredStars.map(star => (
            <div key={star._id} draggable={false}>
              <NavLink 
                to={`/star/${star._id}`} 
                className={({ isActive }) => isActive ? 'active' : ''}
                draggable={false}
              >
                {star.starname}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
