import { createSelector } from '@reduxjs/toolkit';

import type { TRootState } from './store';

export const selectIngredientCounts = createSelector(
  [(state: TRootState) => state.burgerConstructor],
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