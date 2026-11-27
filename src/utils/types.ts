export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

// Типы для авторизации
export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};

export type TPasswordResetResponse = {
  success: boolean;
  message: string;
};