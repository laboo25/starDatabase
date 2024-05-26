import React from 'react'
import './navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <>
            <div style={{ padding: '10px', height: '5vh;'}}>
                <div id='navbar'>
                    <div id='logo'>
                        <Link to='/' draggable="false">
                            starDB
                        </Link>
                    </div>
                    <div id='search_fields'>
                        <input type="search" />
                        <button>search</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar