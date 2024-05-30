// Home.js
import React, { useEffect, useState } from 'react';
import './home.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [starTitles, setStarTitles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStarTitles = async () => {
            try {
                const res = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
                const sortedData = res.data.sort((a, b) => a.starname.localeCompare(b.starname));
                setStarTitles(sortedData);
            } catch (error) {
                setError(error);
            }
        };

        fetchStarTitles();

        return () => {
            // Cleanup function to cancel the request if component unmounts
        };
    }, []);

    return (
        <>
            <div>
                <div id='home'>
                    <div className='wrapper'>
                            {error ? (
                                <div className="error">An error occurred: {error.message}</div>
                            ) : (
                                starTitles.map((star, index) => (
                                    <div className='card' key={index}>
                                        <div style={{width: "100%"}}>
                                            <Link to={`/star/${star._id}`}>
                                                <img src={star.starcover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            </Link>
                                        </div>
                                        <p className='title'>{star.starname}</p>
                                    </div>
                                ))
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
