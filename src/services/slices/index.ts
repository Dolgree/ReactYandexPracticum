import { combineSlices } from '@reduxjs/toolkit';

import { ingredientsApi } from '../api';
import { burgerConstructorSlice } from './burger-constructor-slice';
import { ingredientDetailsSlice } from './ingredient-details-slice';

export const rootReducer = combineSlices(
  ingredientsApi,
  burgerConstructorSlice,
  ingredientDetailsSlice
);