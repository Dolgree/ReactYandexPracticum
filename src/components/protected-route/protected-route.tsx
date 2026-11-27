import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@hooks/use-redux';

import styles from './protected-route.module.css';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useAppSelector((state) => state.user);
  const location = useLocation();

  // 1. Пока идет проверка токенов при старте — показываем прелоадер
  if (!isAuthChecked) {
    return (
      <div className={styles.loader}>
        <Preloader />
      </div>
    );
  }

  // 2. Если маршрут ТОЛЬКО для неавторизованных, а юзер залогинен
  if (onlyUnAuth && user) {
    const from =
      (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // 3. Если маршрут ТОЛЬКО для авторизованных, а юзер не залогинен
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Все проверки пройдены — рендерим компонент
  return <>{children}</>;
};