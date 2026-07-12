import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobCartReducer from "../features/jobs/jobCartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobCart: jobCartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
