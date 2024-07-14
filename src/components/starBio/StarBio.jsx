import React from 'react';
import { CiMenuFries } from "react-icons/ci";
import { IoChevronBackSharp } from "react-icons/io5";
import moment from 'moment';
import Sidebar from './Sidebar';

const StarBio = ({ starName, starBio, navigate, sidebarVisible, setSidebarVisible, sidebarRef, showCover }) => {
    const calculateAge = (birthdate) => {
        return moment().diff(birthdate, 'years');
    };

    const formatShoeSize = (size) => {
        if (!size) return null;
        const number = parseInt(size, 10);
        if (number >= 1 && number <= 20) {
            return `${size} US`;
        } else if (number >= 21 && number <= 50) {
            return `${size} EU`;
        }
        return size;
    };

    const renderArrayItems = (items) => {
        if (!items || items.length === 0) return null;
        return items.map((item, index) => (
            <span key={index}>
                {item}{index === items.length - 1 ? '' : ', '}
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
            <div id='starbio-main'>
                <button
                    id='historyback'
                    className='absolute top-5 left-5 p-1 bg-[#fff7] text-[red] md:hidden'
                    onClick={() => navigate(-1)}
                    style={{ display: window.history.length > 1 ? 'block' : 'none' }}
                >
                    <IoChevronBackSharp />
                </button>
                <button
                    className='menu-toggle'
                    onClick={() => setSidebarVisible(!sidebarVisible)}>
                    <CiMenuFries />
                </button>
                <div ref={sidebarRef} className={`sidebar ${sidebarVisible ? 'show-sidebar' : ''}`}>
                    <Sidebar />
                </div>
                <div id='star-bio'>
                    {starName && starName.starprofile ? (
                        <div id='bio-page' className='w-full flex '>
                            
                            <div className='profile'>
                                {starName && <img src={starName.starprofile} alt={starName.starname} draggable={false} />}
                            </div>
                            <div className='bio'>
                                {starName && <h2 className='title'>{starName.starname}</h2>}
                                <div className='bio-texts'>
                                    {starBio ? (
                                        <>
                                            {starBio.aliases && (
                                                <div>
                                                    <span className='fontMedium'>Aliases:</span>
                                                    <span className='fontReg'>{renderArrayItems(starBio.aliases)}</span>
                                                </div>
                                            )}
                                            {starBio.birthname && (
                                                <div>
                                                    <span className='fontMedium'>Birth Name:</span>
                                                    <span className='fontReg'>{starBio.birthname}</span>
                                                </div>
                                            )}
                                            {starBio.birthplace && (
                                                <div>
                                                    <span className='fontMedium'>Birthplace:</span>
                                                    <span className='fontReg'>{starBio.birthplace}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className='fontMedium'>Age:</span>
                                                <span className='fontReg'>{starBio.birthdate ? calculateAge(starBio.birthdate) : 'Unknown'}</span>
                                            </div>
                                            {starBio.birthdate && (
                                                <div>
                                                    <span className='fontMedium'>Birthdate:</span>
                                                    <span className='fontReg'>{moment(starBio.birthdate).format('DD-MMM-YYYY')}</span>
                                                </div>
                                            )}
                                            {starBio.deathdate && (
                                                <div>
                                                    <span className='fontMedium'>Death Date:</span>
                                                    <span className='fontReg'>{moment(starBio.deathdate).format('DD-MMM-YYYY')}</span>
                                                </div>
                                            )}
                                            {starBio.occupation && (
                                                <div>
                                                    <span className='fontMedium'>Occupation:</span>
                                                    <span className='fontReg'>{renderArrayItems(starBio.occupation)}</span>
                                                </div>
                                            )}
                                            {starBio.status && (
                                                <div>
                                                    <span className='fontMedium'>Status:</span>
                                                    <span className={`fontReg text-[#fff] px-[10px] ${getStatusClass(starBio.status)}`}>{starBio.status}</span>
                                                </div>
                                            )}
                                            {starBio.start && (
                                                <div>
                                                    <span className='fontMedium'>Start:</span>
                                                    <span className='fontReg'>{starBio.start}</span>
                                                </div>
                                            )}
                                            {starBio.end && (
                                                <div>
                                                    <span className='fontMedium'>End:</span>
                                                    <span className='fontReg'>{starBio.end}</span>
                                                </div>
                                            )}
                                            {starBio.ethnicity && (
                                                <div>
                                                    <span className='fontMedium'>Ethnicity:</span>
                                                    <span className='fontReg'>{starBio.ethnicity}</span>
                                                </div>
                                            )}
                                            {starBio.height && (
                                                <div>
                                                    <span className='fontMedium'>Height:</span>
                                                    <span className='fontReg'>{starBio.height}</span>
                                                </div>
                                            )}
                                            {starBio.hair && (
                                                <div>
                                                    <span className='fontMedium'>Hair:</span>
                                                    <span className='fontReg'>{starBio.hair}</span>
                                                </div>
                                            )}
                                            {starBio.eyes && (
                                                <div>
                                                    <span className='fontMedium'>Eyes:</span>
                                                    <span className='fontReg'>{starBio.eyes}</span>
                                                </div>
                                            )}
                                            {starBio.shoesize && (
                                                <div>
                                                    <span className='fontMedium'>Shoe Size:</span>
                                                    <span className='fontReg'>{formatShoeSize(starBio.shoesize)}</span>
                                                </div>
                                            )}
                                            <div>
                                                <span className='fontMedium'>Measurement:</span>
                                                {starBio.measurement && starBio.measurement.map((item, index) => (
                                                    <span key={index} className='fontReg'>
                                                        <span>{item.bust}</span>
                                                        <span>{item.cup}</span>
                                                        <span>–</span>
                                                        <span>{item.waist}</span>
                                                        <span>–</span>
                                                        <span>{item.hips}</span>
                                                    </span>
                                                ))}
                                            </div>
                                            {starBio.tattoos && (
                                                <div>
                                                    <span className='fontMedium'>Tattoos:</span>
                                                    <span className='fontReg'>{starBio.tattoos}</span>
                                                </div>
                                            )}
                                            {starBio.piercings && (
                                                <div>
                                                    <span className='fontMedium'>Piercings:</span>
                                                    <span className='fontReg'>{starBio.piercings}</span>
                                                </div>
                                            )}
                                            {starBio.skills && (
                                                <div>
                                                    <span className='fontMedium'>Skills:</span>
                                                    <span className='fontReg'>{renderArrayItems(starBio.skills)}</span>
                                                </div>
                                            )}
                                            {starBio.pubic && (
                                                <div>
                                                    <span className='fontMedium'>Pubic Hair:</span>
                                                    <span className='fontReg'>{starBio.pubic}</span>
                                                </div>
                                            )}
                                            {starBio.boobs && (
                                                <div>
                                                    <span className='fontMedium'>Boobs:</span>
                                                    <span className='fontReg'>{starBio.boobs}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className='bio-message'>
                                            <p>Empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div id='cover' className='w-full flex items-center'>
                            <div id='cover-wrapper' className='w-[250px] h-[250px] rounded-full'>
                                {starName && <img src={starName.starcover} alt={`Cover for ${starName.starname}`} className='w-full h-full object-cover rounded-full' />}
                            </div>
                            <div>
                                {starName && <h2 className='title'>{starName.starname}</h2>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StarBio;
