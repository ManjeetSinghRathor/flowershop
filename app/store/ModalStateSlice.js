import { createSlice } from '@reduxjs/toolkit';

const ModalStateSlice = createSlice({
  name: 'ModalState',
  initialState: { overlays: false, searchModal: false },
  reducers: {
    openOverlays : (state) => { state.overlays = true; },
    closeOverlays : (state) => { state.overlays = false; },
    openSearchModal : (state) => { state.searchModal = true; },
    closeSearchModal : (state) => { state.searchModal = false; },
  },
});

export const { openOverlays, closeOverlays, openSearchModal, closeSearchModal } = ModalStateSlice.actions;
export default ModalStateSlice.reducer;
