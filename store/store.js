import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import authReducer from "./slices/authSlice";
import readerReducer from "./slices/readerSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    reader: readerReducer,
  },
});