// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { saveState } from "../utils/localStorage";
import CartProductsReducer from './CartProductsSlice';

const store = configureStore({
  reducer: {
    CartProducts: CartProductsReducer,
  },
});

// Hydration flag
let hasHydrated = false;

// Only save after hydration
store.subscribe(() => {
  if (!hasHydrated) return;

  const state = store.getState();

  saveState("CartProducts", state.CartProducts)
});

export const markHydrated = () => {
  hasHydrated = true;
};

export default store;
