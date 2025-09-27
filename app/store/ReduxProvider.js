"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import store, { markHydrated } from ".";
import { loadState } from "../utils/localStorage";
import { AddProduct } from "./CartProductsSlice";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    const savedCart = loadState("CartProducts"); // always an array now

    if (savedCart) {
      savedCart.forEach((item) => {
        store.dispatch(AddProduct({ id: item.id, q: item.q }));
      });
    }

    // ✅ Allow saving after hydration
    markHydrated();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
