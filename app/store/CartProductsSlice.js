import { createSlice } from '@reduxjs/toolkit';

const CartProductsSlice = createSlice({
  name: 'CartProducts',
  initialState: [],
  reducers: {
    AddProduct: (state, action) => {
      const { id, q, sizeIdx = 0, deliveryTime = "1-2 days" } = action.payload;
      const existing = state.find(
        item => item.id === id && item.sizeIdx === sizeIdx && item.deliveryTime === deliveryTime
      );

      if (existing) {
        existing.q += q;
      } else {
        state.push({ id, q, sizeIdx, deliveryTime });
      }
    },

    removeProduct: (state, action) => {
      const { id, sizeIdx = 0, deliveryTime = "1-2 days" } = action.payload;
      return state.filter(
        item => !(item.id === id && item.sizeIdx === sizeIdx && item.deliveryTime === deliveryTime)
      );
    },

    IncreaseQty: (state, action) => {
      const { id, sizeIdx = 0, deliveryTime = "1-2 days" } = action.payload;
      const item = state.find(
        p => p.id === id && p.sizeIdx === sizeIdx && p.deliveryTime === deliveryTime
      );
      if (item) item.q += 1;
    },

    DecreaseQty: (state, action) => {
      const { id, sizeIdx = 0, deliveryTime = "1-2 days" } = action.payload;
      const item = state.find(
        p => p.id === id && p.sizeIdx === sizeIdx && p.deliveryTime === deliveryTime
      );
      if (item && item.q > 1) item.q -= 1;
    },

    // ✅ Replace entire cart
    setCart: (state, action) => {
      return action.payload.map(item => ({
        id: item.id,
        q: item.q,
        sizeIdx: item.sizeIdx ?? 0,
        deliveryTime: item.deliveryTime ?? "1-2 days",
      }));
    },
  },
});

export const { AddProduct, removeProduct, IncreaseQty, DecreaseQty, setCart } =
  CartProductsSlice.actions;

export default CartProductsSlice.reducer;
