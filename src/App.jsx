// App.js
import React from 'react';
import './App.css'
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home';

// import Images from './components/images/Images';

const App = () => {
  return (
    <div className='main-app'>
      <Navbar/>
      {/* <Images/> */}
      <Home/>
    </div>
  );
};

export default App;
