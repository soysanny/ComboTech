import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootState, store } from "./store";

/**
 * Typed Redux hooks. Always import these instead of the raw react-redux hooks
 * so state and dispatch stay fully typed across the app.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof store>();
