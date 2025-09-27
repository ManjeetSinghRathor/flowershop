import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

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
      toast.success("Item Add to Cart")
    },
    removeProduct: (state, action) => {
      const { id } = action.payload;
      return state.filter(item => item.id !== id);
    },
  },
});

export const { AddProduct, removeProduct } = CartProductsSlice.actions;
export default CartProductsSlice.reducer;
