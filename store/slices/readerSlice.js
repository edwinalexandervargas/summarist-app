import { createSlice } from "@reduxjs/toolkit";

const readerSlice = createSlice({
  name: "reader",
  initialState: {
    fontSize: "medium", // "small" | "medium" | "large" | "xlarge"
  },
  reducers: {
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
  },
});

export const { setFontSize } = readerSlice.actions;
export default readerSlice.reducer;