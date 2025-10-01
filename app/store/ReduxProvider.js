"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import store, { markHydrated } from ".";
import { loadState } from "../utils/localStorage";
import { AddProduct } from "./CartProductsSlice";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    const savedCart = loadState("CartProducts") ?? [];

    // Optional: clear stale cart
    localStorage.removeItem("CartProducts");

    savedCart.forEach((item) => {
      store.dispatch(
        AddProduct({
          id: item.id,
          q: item.q,
          sizeIdx: item.sizeIdx ?? 0,
          deliveryTime: item.deliveryTime ?? "1-2 days",
        })
      );
    });

    markHydrated();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
