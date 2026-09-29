import { API_URL } from './constants';

import type { TIngredientsResponse } from './types';

export const getIngredients = async (): Promise<TIngredientsResponse> => {
  const response = await fetch(`${API_URL}/ingredients`);

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  const data: TIngredientsResponse = await response.json();

  if (!data.success) {
    throw new Error('API вернуло сообщение об ошибке');
  }

  return data;
};