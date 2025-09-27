"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import store, { markHydrated } from ".";
import { loadState } from "../utils/localStorage";
import { closeOverlays, closeSearchModal, openOverlays, openSearchModal } from "./ModalStateSlice";


export default function ReduxProvider({ children }) {
  useEffect(() => {
    
    const ModalState = loadState("ModalState");
    if(ModalState?.overlays === false) store.dispatch(closeOverlays());
    else if(ModalState?.overlays === true) store.dispatch(openOverlays());

    if(ModalState?.searchModal === false) store.dispatch(closeSearchModal());
    else if(ModalState?.searchModal === true) store.dispatch(openSearchModal());
    
    
    // ✅ Allow saving after hydration
    markHydrated();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
