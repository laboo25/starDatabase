// App.js
import React from 'react';
import Home from './components/home/Home';
import CreateStarBio from './components/create/CreateStarBio';

const App = () => {
  return (
    <div>
      <CreateStarBio/>
      <Home/>
    </div>
  );
};

export default App;
