import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_URL } from '@utils/constants';
import { setUser, clearUser } from './slices/user-slice';

import type {
  TIngredientsResponse,
  TOrderResponse,
  TAuthResponse,
  TUser,
  TRefreshResponse,
  TLogoutResponse,
  TPasswordResetResponse,
} from '@utils/types';

//базовый запрос
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('authorization', accessToken);
    }
    return headers;
  },
});

// Обертка с логикой обновления токена
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Если сервер вернул 401 или 403 (токен протух)
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/token',
          method: 'POST',
          body: { token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as TRefreshResponse;
        // Сохраняем новые токены
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Повторяем исходный запрос
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Если refresh не удался — чистим токены и стор
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.dispatch(clearUser());
      }
    }
  }

  return result;
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: baseQueryWithReauth, // Используем нашу обертку
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredientsResponse, void>({
      query: () => '/ingredients',
    }),
    createOrder: builder.mutation<TOrderResponse, { ingredients: string[] }>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
    }),

    //эндпоинты для авторизации
    register: builder.mutation<TAuthResponse, { email: string; password: string; name: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          dispatch(setUser(data.user));
        } catch {
          // Ошибка обрабатывается в компоненте
        }
      },
    }),

    login: builder.mutation<TAuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          dispatch(setUser(data.user));
        } catch {
          // Ошибка обрабатывается в компоненте
        }
      },
    }),

    logout: builder.mutation<TLogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: { token: localStorage.getItem('refreshToken') },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(clearUser());
        } catch {
          // Ошибка обрабатывается в компоненте
        }
      },
    }),

        //  Восстановление пароля
    forgotPassword: builder.mutation<TPasswordResetResponse, { email: string }>({
      query: (body) => ({
        url: '/password-reset',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<TPasswordResetResponse, { password: string; token: string }>({
      query: (body) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body,
      }),
    }),

    getUser: builder.query<{ success: boolean; user: TUser }, void>({
      query: () => '/auth/user',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user)); //  Сохраняем юзера в Redux
        } catch {
          dispatch(clearUser()); //  Если токен невалиден — чистим
        }
      },
    }),

    updateUser: builder.mutation<
      { success: boolean; user: TUser },
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/user',
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user)); //  обновляем юзера в Redux
        } catch {
          // Ошибка обрабатывается в компоненте
        }
      },
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useCreateOrderMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation
} = ingredientsApi;