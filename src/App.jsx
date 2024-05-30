// App.js
import React from 'react';
import Home from './components/home/Home';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <div>
        <Link to='create'>create data</Link>
      </div>
      <Home/>
    </div>
  );
};

export default App;
