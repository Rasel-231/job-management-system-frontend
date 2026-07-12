import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { TJob, TJobCartItem } from "./types";

type TJobCartState = { items: TJobCartItem[] };
const initialState: TJobCartState = { items: [] };

const jobCartSlice = createSlice({
  name: "jobCart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<TJob>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        toast.info("This job is already in your cart");
        return;
      }
      state.items.push({ ...action.payload, addedAt: new Date().toISOString() });
      toast.success("Job added to cart");
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = jobCartSlice.actions;
export default jobCartSlice.reducer;
