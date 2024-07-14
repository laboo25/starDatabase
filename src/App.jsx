// App.js
import React from 'react';
import './App.css'
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home';
import Controller from './components/controller/Controller';

// import Images from './components/images/Images';

const App = () => {
  return (
    <div className='main-app'>
      <Controller/>
      <Navbar/>
      
      <Home/>
    </div>
  );
};

export default App;
