import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createStar as createStarAPI, updateStar as updateStarAPI, deleteStar as deleteStarAPI, getStars as getStarsAPI } from '../api/allApi';

// Create async thunks
export const createStar = createAsyncThunk(
  '/stars/create-star/create-new-star',
  async (data, { rejectWithValue }) => {
    try {
      const result = await createStarAPI(data);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStar = createAsyncThunk(
  '/stars/create-star/updateStar',
  async ({ starId, data }, { rejectWithValue }) => {
    try {
      const result = await updateStarAPI(starId, data);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteStar = createAsyncThunk(
  '/stars/create-star/deleteStar',
  async (starId, { rejectWithValue }) => {
    try {
      const result = await deleteStarAPI(starId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStars = createAsyncThunk(
  '/stars/create-star/getStars',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getStarsAPI();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const starSlice = createSlice({
  name: 'stars',
  initialState: {
    stars: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createStar
      .addCase(createStar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createStar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stars.push(action.payload);
      })
      .addCase(createStar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // updateStar
      .addCase(updateStar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateStar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.stars.findIndex(star => star.id === action.payload.id);
        if (index !== -1) {
          state.stars[index] = action.payload;
        }
      })
      .addCase(updateStar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // deleteStar
      .addCase(deleteStar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteStar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stars = state.stars.filter(star => star.id !== action.payload.id);
      })
      .addCase(deleteStar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // getStars
      .addCase(getStars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stars = action.payload;
      })
      .addCase(getStars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default starSlice.reducer;
