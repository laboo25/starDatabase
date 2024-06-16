import React, { useState, useEffect, useRef } from 'react';
import logo from '../../../public/meu.svg'
import { IoIosAlbums } from "react-icons/io";
import { BsImages } from "react-icons/bs";
import { RiAddBoxFill } from "react-icons/ri";
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (searchQuery) {
            try {
                const response = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
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

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
                setIsSearchVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef]);

    return (
        <>
            <div style={{ padding: '10px', height: '5vh;' }}>
                <div id='navbar' className='py-2'>
                    <div id='logo' >
                        <Link to='/' draggable="false">
                            <img src={logo} alt="" className='w-full h-[25px]' draggable={false}/>
                        </Link>
                    </div>
                    <div>
                        <div className='mx-2 text-black'>
                            <Link to='/albums' className='p-[10px] px-[20px]' draggable={false}>
                                <IoIosAlbums className='size-[25px]' />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className=' mx-2  ' >
                            <Link to='/images' className='p-[10px] px-[20px]' draggable={false}>
                                <BsImages className='size-[25px]'/>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className='mx-2 text-black'>
                            <Link to='create' className='p-[10px] px-[20px]' draggable={false}>
                                <RiAddBoxFill  className='size-[25px]'/> 
                            </Link>
                        </div>
                    </div>
                    <div id='search_fields' ref={searchRef}>
                        <div 
                            className='search-toggle-icon' 
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                        >
                            srch
                        </div>
                        {isSearchVisible && (
                            <div className='search-inpt'>
                                <input 
                                    type="search" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search stars..."
                                />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(''); setSuggestions([]); }}>
                                        <div className='mx-2 px-[5px] py-[-1px] bg-[#cfcfcf98] rounded-[50%]'>
                                            x
                                        </div>
                                    </button>
                                )}
                                <button onClick={handleSearch}>search</button>
                                {suggestions.length > 0 && (
                                    <div className='suggestion'>
                                        {suggestions.map((star) => (
                                            <div key={star._id}>
                                                <Link to={`/query/${star._id}`} onClick={() => { 
                                                    setSearchQuery(''); 
                                                    navigate(`/query/${star._id}`);
                                                }}>
                                                    {star.starname}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
