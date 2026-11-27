import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsApi } from '../api';
import { burgerConstructorSlice } from './burger-constructor-slice';
import { userSlice } from './user-slice';

export const rootReducer = combineSlices(
  ingredientsApi,
  burgerConstructorSlice,
  userSlice
);