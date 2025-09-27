// src/store/index.js
import { configureStore, current } from '@reduxjs/toolkit';
import { saveState } from "../utils/localStorage";
import ModalStateReducer from './ModalStateSlice';

const store = configureStore({
  reducer: {
    ModalState: ModalStateReducer,
  },
});

// Hydration flag
let hasHydrated = false;

// Only save after hydration
store.subscribe(() => {
  if (!hasHydrated) return;

  const state = store.getState();

  saveState("ModalState", state.ModalState)
});

export const markHydrated = () => {
  hasHydrated = true;
};

export default store;
