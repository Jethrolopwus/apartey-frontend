import { configureStore } from '@reduxjs/toolkit';
import propertyReviewFormReducer from './propertyReviewFormSlice';

export const store = configureStore({
  reducer: {
    propertyReviewForm: propertyReviewFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 