import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export type TConstructorIngredient = TIngredient & { id: string };

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() } as TConstructorIngredient,
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return;
      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

// ----- Селекторы -----

// Минимальный тип состояния — только то, что нужно селекторам.
// Так мы избегаем циклического импорта TRootState из store.
type TStateWithConstructor = {
  burgerConstructor: TBurgerConstructorState;
};

const selectConstructorState = (
  state: TStateWithConstructor
): TBurgerConstructorState => state.burgerConstructor;

/**
 * Количество каждого ингредиента в конструкторе.
 * Булки считаются как 2 (верх + низ).
 * Возвращает объект вида { [_id]: count }.
 */
export const selectIngredientCounts = createSelector(
  [selectConstructorState],
  (constructor) => {
    const counts: Record<string, number> = {};

    if (constructor.bun) {
      counts[constructor.bun._id] = 2;
    }

    for (const item of constructor.ingredients) {
      counts[item._id] = (counts[item._id] ?? 0) + 1;
    }

    return counts;
  }
);

/**
 * Итоговая стоимость бургера:
 * булка × 2 + сумма всех начинок и соусов.
 */
export const selectTotalPrice = createSelector(
  [selectConstructorState],
  (constructor) => {
    const bunPrice = constructor.bun ? constructor.bun.price * 2 : 0;
    const fillingsPrice = constructor.ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + fillingsPrice;
  }
);