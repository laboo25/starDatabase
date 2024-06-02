import React, { useEffect, useState } from 'react';
import './home.css';
import axiosInstance from '../../app/axiosInstance';
import { Link, useLocation } from 'react-router-dom';
import { Pagination } from 'antd';

const Home = () => {
    const [starTitles, setStarTitles] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const location = useLocation();

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

        const savedItemsPerPage = sessionStorage.getItem('itemsPerPage');
        if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
    }, []);

    useEffect(() => {
        sessionStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    useEffect(() => {
        sessionStorage.setItem('itemsPerPage', itemsPerPage);
    }, [itemsPerPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (current, size) => {
        setItemsPerPage(size);
        setCurrentPage(1); // Reset to first page
    };

    const totalPages = Math.ceil(starTitles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStarTitles = starTitles.slice(startIndex, endIndex);

    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem(`scrollPosition-${currentPage}`, window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage]);

    useEffect(() => {
        if (location.pathname === '/home') {
            const savedScrollPosition = sessionStorage.getItem(`scrollPosition-${currentPage}`);
            if (savedScrollPosition) {
                window.scrollTo(0, Number(savedScrollPosition));
            }
        }
    }, [location, currentPage]);

    return (
        <>
            <div>
                <div id='home'>
                    <div className='wrapper'>
                        {error ? (
                            <div className="error">An error occurred: {error.message}</div>
                        ) : (
                            currentStarTitles.map((star, index) => (
                                <div className='card' key={index}>
                                    <div style={{ width: "100%" }}>
                                        <Link 
                                            to={`/star/${star._id}`}
                                            onClick={() => sessionStorage.setItem(`scrollPosition-${currentPage}`, window.scrollY)}
                                        >
                                            <img src={star.starcover} alt={star.starname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </Link>
                                    </div>
                                    <p className='title'>{star.starname}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div id='home-pagination'>
                    <Pagination 
                        current={currentPage} 
                        total={starTitles.length} 
                        pageSize={itemsPerPage} 
                        showSizeChanger
                        pageSizeOptions={['10', '50', '100']}
                        onChange={handlePageChange} 
                        onShowSizeChange={handlePageSizeChange}
                    />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
