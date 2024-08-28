import React from 'react';
import './controller.css';
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { TbReload } from "react-icons/tb";

// Define the Controller component
const Controller = () => {
    // Handle the click event for the "previous" button
    const handlePrevious = () => {
        window.history.back(); // Navigate to the previous page in the history
    };

    // Handle the click event for the "next" button
    const handleNext = () => {
        window.history.forward(); // Navigate to the next page in the history
    };

    // Handle the click event for the "reload" button
    const handleReload = () => {
        window.location.reload(); // Reload the current page
    };

    return (
        <div id='controller-main' className='sm:hidden'>
            <div id='controllers'>
                {/* Button for going to the previous page */}
                <button onClick={handlePrevious}>
                    <GrFormPreviousLink />
                    {/* previous button */}
                </button>
                {/* Button for reloading the current page */}
                <button onClick={handleReload}>
                    <TbReload />
                    {/* reload button */}
                </button>
                {/* Button for going to the next page */}
                <button onClick={handleNext}>
                    <GrFormNextLink />
                    {/* next button */}
                </button>
            </div>
        </div>
    );
};

export default Controller;
