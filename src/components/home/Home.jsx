import React, { useEffect, useState } from 'react';
import './home.css';
import axiosInstance from '../../app/axiosInstance';
import { Link } from 'react-router-dom';

const Home = () => {
    const [starTitles, setStarTitles] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchStarTitles = async () => {
            try {
                const storedStarTitles = localStorage.getItem('starTitles');
                if (storedStarTitles) {
                    setStarTitles(JSON.parse(storedStarTitles));
                }

                const res = await axiosInstance.get('/stars/create-star/get-all-star');
                const sortedData = res.data.sort((a, b) => a.starname.localeCompare(b.starname));
                
                // Filter out stars without a starcover
                const filteredData = sortedData.filter(star => star.starcover);
                
                if (JSON.stringify(filteredData) !== storedStarTitles) {
                    setStarTitles(filteredData);
                    localStorage.setItem('starTitles', JSON.stringify(filteredData));
                }
            } catch (error) {
                setError(error);
            }
        };

        fetchStarTitles();
    }, []);

    useEffect(() => {
        const savedPage = sessionStorage.getItem('currentPage');
        if (savedPage) setCurrentPage(Number(savedPage));
    }, []);

    useEffect(() => {
        sessionStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(starTitles.length / itemsPerPage);

    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem('scrollPosition', window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem('scrollPosition');
        if (savedScrollPosition) {
            window.scrollTo(0, Number(savedScrollPosition));
        }
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
                                    <div style={{ width: "100%" }}>
                                        <Link to={`/star/${star._id}`}>
                                            <img src={star.starcover} alt={star.starname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
