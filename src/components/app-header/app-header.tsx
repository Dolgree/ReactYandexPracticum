import { NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  // Вспомогательная функция для формирования классов
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.link_active : ''}`;

  // Вспомогательная функция для текста (активный — белый, неактивный — серый)
  const getTextClass = (isActive: boolean) =>
    `text text_type_main-default ml-2 ${isActive ? '' : 'text_color_inactive'}`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор: end означает, что ссылка активна только на "/" */}
          <NavLink to="/" end className={getLinkClass}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className={getTextClass(isActive)}>Конструктор</p>
              </>
            )}
          </NavLink>

          {/* Лента заказов: без end, поэтому активна и на вложенных маршрутах */}
          <NavLink
            to="/feed"
            className={({ isActive }) => `${getLinkClass({ isActive })} ml-10`}
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className={getTextClass(isActive)}>Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>

        {/* Личный кабинет: без end, активна и на /profile/orders */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${getLinkClass({ isActive })} ${styles.link_position_last}`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className={getTextClass(isActive)}>Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};