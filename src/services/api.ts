import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

import type {
  TIngredientsResponse,
  TOrderResponse,
} from '@utils/types';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredientsResponse, void>({
      query: () => '/ingredients',
    }),

    createOrder: builder.mutation<TOrderResponse, { ingredients: string[] }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = ingredientsApi;