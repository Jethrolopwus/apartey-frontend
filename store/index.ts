import { configureStore } from '@reduxjs/toolkit';
import propertyReviewFormReducer from './propertyReviewFormSlice';
import authReducer from './authSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    propertyReviewForm: propertyReviewFormReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;