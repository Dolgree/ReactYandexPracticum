import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@hooks/use-redux';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
        <Preloader />
      </div>
    );
  }

  // 2. Если маршрут ТОЛЬКО для неавторизованных (логин, регистрация), а юзер залогинен
  // Возвращаем его туда, откуда он пришел (или на главную)
  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // 3. Если маршрут ТОЛЬКО для авторизованных (профиль), а юзер не залогинен
  // Кидаем на логин и запоминаем, куда он хотел попасть
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};