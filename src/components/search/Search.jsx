import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                try {
                    const response = await axios.get('https://stardatabase-api-production.up.railway.app/api/stars/create-star/get-all-star');
                    const filteredData = response.data.filter(star => 
                        star.starname.toLowerCase().includes(query.toLowerCase())
                    );
                    setResults(filteredData);
                } catch (error) {
                    console.error('Error fetching star data:', error);
                }
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div>
            <h1>Search Results for "{query}"</h1>
            <ul>
                {results.map(star => (
                    <li key={star._id}>{star.starname}</li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
