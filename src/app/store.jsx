// store.js
import { configureStore } from '@reduxjs/toolkit';
import starSlice from '../features/starSlice';
const store = configureStore({
  reducer: {
    stars: starSlice,
    
  },
});

export default store;
