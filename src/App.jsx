// App.js
import React from 'react';
import Home from './components/home/Home';
import CreateStarBio from './components/create/CreateStarBio';
import CreateAlbums from './components/create/CreateAlbums';
import CreateStar from './components/create/CreateStar';

const App = () => {
  return (
    <div>
      <CreateStar/>
      <CreateAlbums/>
      <CreateStarBio/>
      <Home/>
    </div>
  );
};

export default App;
