import React, { useState, useEffect, useRef } from 'react';
import logo from '/meu.svg';
import { IoIosAlbums } from "react-icons/io";
import { BsImages } from "react-icons/bs";
import { RiAddBoxFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import avater from "/avater.webp"

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const fetchSuggestions = async () => {
        if (searchQuery) {
            try {
                const response = await axios.get('https://stardatabase-api-production.up.railway.app/api/stars/create-star/get-all-star');
                const filteredData = response.data.filter(star => 
                    star.starname.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setSuggestions(filteredData);
            } catch (error) {
                console.error('Error fetching star data:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = () => {
        if (searchQuery) {
            navigate(`/query?search=${searchQuery}`);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
                setIsSearchVisible(false);
            }
        };

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 600);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div id='navbar'>
            <div id='logo'>
                <Link to='/' draggable="false">
                    <img src={logo} alt="Logo" className='w-full h-[25px]' draggable={false} />
                </Link>
            </div>
            <div>
                <Link to='/albums' className='p-[10px] px-[20px]' draggable={false}>
                    <IoIosAlbums className='size-[25px]' />
                </Link>
            </div>
            <div>
                <Link to='/images' className='p-[10px] px-[20px]' draggable={false}>
                    <BsImages className='size-[25px]' />
                </Link>
            </div>
            <div>
                <Link to='/create' className='p-[10px] px-[20px]' draggable={false}>
                    <RiAddBoxFill className='size-[25px]' />
                </Link>
            </div>
            <div id='search_fields' className="mx-2 text-black" ref={searchRef}>
                {isSmallScreen && (
                    <div
                        className='search-toggle-icon p-[10px] px-[20px]'
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                    >
                        <FaSearch className='size-[25px]' />
                    </div>
                )}
                <div className={`search-inpt ${isSearchVisible || !isSmallScreen ? 'show' : ''}`}>
                    <div>
                    <div className='search-wrapper'>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search stars..."
                    />
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(''); setSuggestions([]); }} className='clear'>
                            <div className='mx-2 p-[3px] bg-[#cfcfcf98] rounded-[50%]'>
                                ×
                            </div>
                        </button>
                    )}
                    <button onClick={handleSearch}><FaSearch className='search'/></button>
                    {suggestions.length > 0 && (
                        <div className='suggestion'>
                            {suggestions.map((star) => (
                                <div key={star._id}>
                                    <Link to={`/star/${star._id}`} onClick={() => {
                                        setSearchQuery('');
                                        navigate(`/star/${star._id}`);
                                    }}>
                                        <div className='flex'>
                                        <div className='w-[60px] aspect-square  '>
                                            <img src={star.starcover || avater} alt="" className='w-full h-full object-cover rounded-[50%]'/>
                                        </div>
                                        <div className='w-auto h-auto flex items-start justify-center flex-col'>
                                        <p className='capitalize font-bold'>{star.starname}</p>
                                        <p className='text-[10px] text-gray-400'>profile</p>
                                        </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
