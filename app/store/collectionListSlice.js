// src/redux/slices/collectionListSlice.js
import { createSlice } from "@reduxjs/toolkit";

const collectionListSlice = createSlice({
  name: "collectionList",
  initialState: {
    data: {},   // stores your collectionList object { categoryName: [collections] }
    loading: false,
    error: null,
  },
  reducers: {
    setCollectionList: (state, action) => {
      state.data = action.payload; // whole collectionList object
      state.loading = false;
      state.error = null;
    },
    clearCollectionList: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCollectionList,
  clearCollectionList,
  setLoading,
  setError,
} = collectionListSlice.actions;

export default collectionListSlice.reducer;
