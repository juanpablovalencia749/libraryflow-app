import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { AnyAction, Reducer } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import booksReducer from './booksSlice';
import loansReducer from './loansSlice';
import loggerReducer from './loggerSlice';

const appReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
  loans: loansReducer,
  logger: loggerReducer,
});

const rootReducer: Reducer = (state: RootState | undefined, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    // Reset state to undefined to trigger initial state in all slices
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
