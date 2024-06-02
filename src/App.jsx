// App.js
import React from 'react';
import './App.css'
import Home from './components/home/Home';
import { Link } from 'react-router-dom';
// import StarUpdate from './components/update/StarUpdate';
// import Images from './components/images/Images';

const App = () => {
  return (
    <div className='pt-[30px] main'>
      <div className='bg-[#ff5733] p-[10px] uppercase rounded-[20px] w-fit ml-[20px] text-white px-[20px]'>
        <Link to='create' className=''>create data</Link>
      </div>
{/*       <StarUpdate/> */}
      {/* <Images/> */}
      <Home/>
    </div>
  );
};

export default App;
