import { configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './api';
import { rootReducer } from './slices';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientsApi.middleware),
});

export type TRootState = ReturnType<typeof rootReducer>;
export type TAppDispatch = typeof store.dispatch;