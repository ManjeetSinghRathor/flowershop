import { createSlice } from '@reduxjs/toolkit';

const CartProductsSlice = createSlice({
  name: 'CartProducts',
  initialState: [],
  reducers: {
    AddProduct: (state, action) => {
      const { id, q } = action.payload;
      const existing = state.find(item => item.id === id);
      if (existing) {
        existing.q += q;
      } else {
        state.push({ id, q }); // Only store ID and quantity, no React elements
      }
    },
    removeProduct: (state, action) => {
      const { id } = action.payload;
      return state.filter(item => item.id !== id);
    },
    IncreaseQty: (state, action) => {
      const id = action.payload;
      const item = state.find(p => p.id === id);
      if (item) item.q += 1;
    },
    DecreaseQty: (state, action) => {
      const id = action.payload;
      const item = state.find(p => p.id === id);
      if (item && item.q > 1) item.q -= 1;
    },
  },
});

export const { AddProduct, removeProduct, IncreaseQty, DecreaseQty } = CartProductsSlice.actions;
export default CartProductsSlice.reducer;
