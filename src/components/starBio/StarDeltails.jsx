import React, { useEffect, useState, useRef } from 'react';
import './starBio.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarImages from '../images/StarImages';
import StarAlbums from '../album/StarAlbums';
import StarBio from './StarBio';

const StarDetails = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [starName, setStarName] = useState(null);
    const [starBio, setStarBio] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState(null);
    const [showCover, setShowCover] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('images');
    const sidebarRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            // Reset state to avoid showing old data
            setStarName(null);
            setStarBio(null);
            setError(null);

            try {
                const storedStarName = localStorage.getItem(`starName_${_id}`);
                const storedStarBio = localStorage.getItem(`starBio_${_id}`);

                if (storedStarName && storedStarBio) {
                    setStarName(JSON.parse(storedStarName));
                    setStarBio(JSON.parse(storedStarBio));
                } else {
                    const titleRes = await axios.get('https://stardb-api.vercel.app/api/stars/create-star/get-all-star');
                    const titleData = titleRes.data.find((item) => item._id === _id);
                    if (titleData) {
                        setStarName(titleData);
                        localStorage.setItem(`starName_${_id}`, JSON.stringify(titleData));

                        const bioRes = await axios.get('https://stardb-api.vercel.app/api/stars/star-bio/get-all-bio');
                        const bioData = bioRes.data.find((bio) => bio.starname === _id);
                        if (bioData) {
                            setStarBio(bioData);
                            localStorage.setItem(`starBio_${_id}`, JSON.stringify(bioData));
                        } else {
                            setStarBio(null); // Clear bio if not found
                        }
                    } else {
                        setError('Star not found');
                    }
                }

                const albumRes = await axios.get('https://stardb-api.vercel.app/api/stars/albums/get-all-albums');
                const albumData = albumRes.data.filter((albm) => albm.starname && albm.starname.includes(_id));
                setAlbums(albumData);

                setShowCover(!(starName && starBio));
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [_id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div>
                <StarBio
                    starName={starName}
                    starBio={starBio}
                    navigate={navigate}
                    sidebarVisible={sidebarVisible}
                    setSidebarVisible={setSidebarVisible}
                    sidebarRef={sidebarRef}
                    showCover={showCover}
                />
            </div>
            <div className='w-full ' id='star-img-albm'>
                <div className='w-full flex bg-[#e7e7e7] capitalize'>
                    <div className={`w-1/2 text-center ${activeTab === 'images' ? 'active' : ''}`}>
                        <button className='w-full py-3' onClick={() => setActiveTab('images')}>images</button>
                    </div>
                    <div className={`w-1/2 text-center ${activeTab === 'albums' ? 'active' : ''}`}>
                        <button className='w-full py-3' onClick={() => setActiveTab('albums')}>albums</button>
                    </div>
                </div>
                <div>
                    {activeTab === 'images' && (
                        <div className='w-full block'>
                            <StarImages starId={_id} />
                        </div>
                    )}
                    {activeTab === 'albums' && (
                        <div className='w-full block'>
                            <StarAlbums starId={_id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StarDetails;
