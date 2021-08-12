import { configureStore } from "@reduxjs/toolkit";
import { projectListSlice } from "screens/projectList/project-list.slice";
import { authSlice } from "./auth.slice";

export const rootReducer = {
  //reducer 的切片
  projectList: projectListSlice.reducer,
  auth: authSlice.reducer,
};

/**
 * 根状态树
 */
export const store = configureStore({
  reducer: rootReducer,
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
