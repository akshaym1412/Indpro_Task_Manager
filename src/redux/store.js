import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // ✅ Import authSlice
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"], // ✅ Persist only auth state
};

const reducer = combineReducers({
  auth: authReducer, // ✅ Add auth reducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
