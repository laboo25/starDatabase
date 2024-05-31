import React, { useEffect, useState } from 'react';
import './starBio.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const StarBio = () => {
    const { _id } = useParams();
    const [starName, setStarName] = useState(null);
    const [starBio, setStarBio] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedStarName = localStorage.getItem(`starName_${_id}`);
                const storedStarBio = localStorage.getItem(`starBio_${_id}`);
                const storedAlbums = localStorage.getItem(`albums_${_id}`);

                if (storedStarName && storedStarBio && storedAlbums) {
                    setStarName(JSON.parse(storedStarName));
                    setStarBio(JSON.parse(storedStarBio));
                    setAlbums(JSON.parse(storedAlbums));
                } else {
                    // Fetch star title data
                    const titleRes = await axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star');
                    const titleData = titleRes.data.find((item) => item._id === _id);
                    if (titleData) {
                        setStarName(titleData);
                        localStorage.setItem(`starName_${_id}`, JSON.stringify(titleData));

                        // Fetch star bio data using the star name or id
                        const bioRes = await axios.get('https://stardb-api.onrender.com/api/stars/star-bio/get-all-bio');
                        const bioData = bioRes.data.find((bio) => bio.starname === _id);
                        if (bioData) {
                            setStarBio(bioData);
                            localStorage.setItem(`starBio_${_id}`, JSON.stringify(bioData));
                        }

                        // Fetch star album data
                        const albumRes = await axios.get('https://stardb-api.onrender.com/api/stars/albums/get-all-albums');
                        const albumData = albumRes.data.filter((albm) => albm.starname && albm.starname.includes(_id));
                        setAlbums(albumData);
                        localStorage.setItem(`albums_${_id}`, JSON.stringify(albumData));

                    } else {
                        setError('Star not found');
                    }
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [_id]);

    const calculateAge = (birthdate) => {
        return moment().diff(birthdate, 'years');
    };

    const formatShoeSize = (size) => {
        if (!size) return null;
        const number = parseInt(size, 10);
        if (number >= 1 && number <= 20) {
            return `${size} us`;
        } else if (number >= 21 && number <= 50) {
            return `${size} eu`;
        }
        return size;
    };

    const renderArrayItems = (items) => {
        if (!items || items.length === 0) return null;
        return items.map((item, index) => (
            <span key={index}>
                {item}{index === items.length - 1 ? ';' : ', '}
            </span>
        ));
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'active-status';
            case 'retired':
                return 'retire-status';
            case 'died':
                return 'died-status';
            default:
                return '';
        }
    };

    return (
        <div>
            {error && <div>Error: {error}</div>}
            <div id='bio-page' className='w-full flex'>
                <div className='profile'>
                    {starName && <img src={starName.starprofile} alt={starName.starname} />}
                </div>
                <div className='bio'>
                    {starName && <h2 className='title'>{starName.starname}</h2>}
                    <div className='bio-texts'>
                        <div>
                            {starBio ? (
                                <>
                                    {starBio.aliases && (
                                        <div className='w-auto flex'>
                                            <div className='font-bold pr-2'>Aliases:</div>
                                            <span className='font-light'>{renderArrayItems(starBio.aliases)}</span>
                                        </div>
                                    )}
                                    {starBio.birthname && (
                                        <div className='font-bold'>
                                            Birth Name:
                                            <span className='font-light pl-2'>{starBio.birthname}</span>
                                        </div>
                                    )}
                                    {starBio.birthplace && (
                                        <div className='font-medium'>
                                            Birthplace:
                                            <span className='font-light pl-2'>{starBio.birthplace}</span>
                                        </div>
                                    )}
                                    <div>Age: {starBio.birthdate ? calculateAge(starBio.birthdate) : 'Unknown'}</div>
                                    {starBio.birthdate && <div>Birthdate: {moment(starBio.birthdate).format('DD-MMM-YYYY')}</div>}
                                    {starBio.deathdate && <div>Death Date: {moment(starBio.deathdate).format('DD-MMM-YYYY')}</div>}
                                    {starBio.occupation && <div>Occupation: {renderArrayItems(starBio.occupation)}</div>}
                                    {starBio.status && <div className={getStatusClass(starBio.status)}>Status: {starBio.status}</div>}
                                    {starBio.start && <div>Start: {starBio.start}</div>}
                                    {starBio.end && <div>End: {starBio.end}</div>}
                                    {starBio.ethnicity && <div>Ethnicity: {starBio.ethnicity}</div>}
                                    {starBio.height && <div>Height: {starBio.height}</div>}
                                    {starBio.hair && <div>Hair: {starBio.hair}</div>}
                                    {starBio.eyes && <div>Eyes: {starBio.eyes}</div>}
                                    {starBio.shoesize && <div>Shoe Size: {formatShoeSize(starBio.shoesize)}</div>}
                                    <div>
                                        {starBio.measurement && starBio.measurement.map((item, index) => (
                                            <p key={index}>
                                                <span>{item.bust}</span>
                                                <span>{item.cup}</span>
                                                <span>–</span>
                                                <span>{item.waist}</span>
                                                <span>–</span>
                                                <span>{item.hips}</span>
                                            </p>
                                        ))}
                                    </div>
                                    {starBio.tattoos && <div>Tattoos: {starBio.tattoos}</div>}
                                    {starBio.piercings && <div>Piercings: {starBio.piercings}</div>}
                                    {starBio.skills && <div>Skills: {renderArrayItems(starBio.skills)}</div>}
                                    {starBio.pubic && <div>Pubic Hair: {starBio.pubic}</div>}
                                    {starBio.boobs && <div>Boobs: {starBio.boobs}</div>}
                                </>
                            ) : (
                                <div>No bio data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {albums.length > 0 ? (
                    albums.map((album, index) => (
                        <div key={index}>
                            <div>{album.albumname}</div>
                            {/* <img src={album.thumburl} alt={`Album ${index + 1}`} /> */}
                        </div>
                    ))
                ) : (
                    <div>No albums found</div>
                )}
            </div>
        </div>
    );
};

export default StarBio;
