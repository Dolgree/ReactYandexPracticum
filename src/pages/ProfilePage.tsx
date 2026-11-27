import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@services/api';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Ошибка выхода', err);
    }
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text text_type_main-medium ${styles.link} ${
      isActive ? styles.link_active : 'text_color_inactive'
    }`;

  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <NavLink to="/profile" end className={getLinkClass}>
          Профиль
        </NavLink>
        <NavLink to="/profile/orders" className={getLinkClass}>
          История заказов
        </NavLink>
        <button
          className={`text text_type_main-medium text_color_inactive ${styles.button}`}
          onClick={handleLogout}
        >
          Выход
        </button>
        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};