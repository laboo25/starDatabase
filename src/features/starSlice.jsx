import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStar as apiGetStars, createStar as apiCreateStar, deleteStar as apiDeleteStar, updateStar as apiUpdateStar } from "../api/allApi";

// Async thunk to get stars
export const getStars = createAsyncThunk(
  "stars/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetStars();
      return response.data; // Assuming response has a `data` property with the star list
    } catch (err) {
      return rejectWithValue(err.response.data || "An error occurred");
    }
  }
);

// Async thunk to create a star
export const createStar = createAsyncThunk(
  "stars/create",
  async (newStar, { rejectWithValue }) => {
    try {
      const response = await apiCreateStar(newStar);
      return response.data; // Assuming response has a `data` property with the new star
    } catch (err) {
      return rejectWithValue(err.response.data || "An error occurred");
    }
  }
);

// Async thunk to delete a star
export const deleteStar = createAsyncThunk(
  "stars/delete",
  async (starId, { rejectWithValue }) => {
    try {
      await apiDeleteStar(starId);
      return starId; // Return the deleted star's ID to remove it from the state
    } catch (err) {
      return rejectWithValue(err.response.data || "An error occurred");
    }
  }
);

// Async thunk to update a star
export const updateStar = createAsyncThunk(
  "stars/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateStar(id, updatedData);
      return response.data; // Assuming response has a `data` property with the updated star
    } catch (err) {
      return rejectWithValue(err.response.data || "An error occurred");
    }
  }
);

// Initial state
const initialState = {
  starList: [],
  loading: false,
  error: null,
};

// Creating the slice
const starSlice = createSlice({
  name: "stars",
  initialState,
  reducers: {
    // Your regular reducers can go here if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle getStars
      .addCase(getStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStars.fulfilled, (state, action) => {
        state.loading = false;
        state.starList = action.payload;
      })
      .addCase(getStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle createStar
      .addCase(createStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStar.fulfilled, (state, action) => {
        state.loading = false;
        state.starList.push(action.payload); // Add the new star to the list
      })
      .addCase(createStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteStar
      .addCase(deleteStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStar.fulfilled, (state, action) => {
        state.loading = false;
        state.starList = state.starList.filter(star => star.id !== action.payload); // Remove the deleted star
      })
      .addCase(deleteStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateStar
      .addCase(updateStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStar.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.starList.findIndex(star => star.id === action.payload.id);
        if (index !== -1) {
          state.starList[index] = action.payload; // Update the star in the list
        }
      })
      .addCase(updateStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default starSlice.reducer;
