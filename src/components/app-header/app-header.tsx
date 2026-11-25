import { NavLink, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const { pathname } = useLocation();

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  const textClass = (isActive: boolean) =>
    `text text_type_main-default ml-2 ${isActive ? '' : 'text_color_inactive'}`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className={textClass(isConstructorActive)}>Конструктор</p>
          </NavLink>

          <NavLink
            to="/feed"
            className={`${styles.link} ml-10 ${isFeedActive ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className={textClass(isFeedActive)}>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>

        <NavLink
          to="/profile"
          className={`${styles.link} ${styles.link_position_last} ${
            isProfileActive ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className={textClass(isProfileActive)}>Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};