import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientModal } from '@components/ingredient-modal/ingredient-modal';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { useAppDispatch } from '@hooks/use-redux';
import { useGetUserQuery } from '@services/api';
import { setAuthChecked } from '@services/slices/user-slice';

import { HomePage } from '@pages/HomePage';
import { IngredientPage } from '@pages/IngredientPage';
import { RegisterPage } from '@pages/RegisterPage';
import { LoginPage } from '@pages/LoginPage';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@pages/ResetPasswordPage';
import { ProfilePage } from '@pages/ProfilePage';
import { ProfileInfoPage } from '@pages/ProfileInfoPage';
import { ProfileOrderPage } from '@pages/ProfileOrderPage';
import { FeedPage } from '@pages/FeedPage';
import { NotFoundPage } from '@pages/NotFoundPage';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const background = location.state?.backgroundLocation;

  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');

  const { isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (!isLoading) {
      dispatch(setAuthChecked(true));
    }
  }, [isLoading, dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        {/*  Защищаем маршруты профиля (если не залогинен - выкинет на логин) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileInfoPage />} />
          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>

        <Route path="/feed" element={<FeedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
        </Routes>
      )}
    </div>
  );
};

export default App;