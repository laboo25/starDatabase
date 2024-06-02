import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const searchRef = useRef(null);

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
                <div id='navbar'>
                    <div id='logo'>
                        <Link to='/' draggable="false">
                            starDB
                        </Link>
                    </div>
                    <div>
                        <div className='bg-[#ff5733] p-[10px] uppercase rounded-[20px] w-fit ml-[20px] text-white px-[20px]'>
                            <Link to='create' className=''>create data</Link>
                        </div>
                    </div>
                    <div id='search_fields' ref={searchRef}>
                        <div 
                            className='search-toggle-icon' 
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                        >
                            search
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
                                                <Link to={`/star/${star._id}`} onClick={() => setSearchQuery('')}>
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
