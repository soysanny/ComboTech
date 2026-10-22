import {
  combineReducers,
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import type { WebStorage } from "redux-persist/lib/types";
import { setAuthTokenAccessor } from "@/services/api/axiosInstance";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";

/**
 * redux-persist requires a storage engine. On the server (Next.js SSR) there is
 * no window/localStorage, so we fall back to an in-memory no-op storage.
 */
function createNoopStorage(): WebStorage {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
}

function createWebStorage(): WebStorage {
  if (typeof window === "undefined") return createNoopStorage();
  const storage = window.localStorage;
  return {
    getItem: (key) => Promise.resolve(storage.getItem(key)),
    setItem: (key, value) => {
      storage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      storage.removeItem(key);
      return Promise.resolve();
    },
  };
}

const storage = createWebStorage();

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(
  {
    key: "svc-store-root",
    version: 1,
    storage,
    // Persist ONLY client/UI state, per the state-ownership rule.
    whitelist: ["auth", "theme"],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Let the shared Axios instance read the latest auth token without importing
// the store (keeps the services layer store-agnostic).
setAuthTokenAccessor(() => store.getState().auth.token);

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
