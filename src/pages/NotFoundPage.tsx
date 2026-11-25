import { Link } from 'react-router-dom';
import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_digits-large">404</h1>
      <p className="text text_type_main-medium mt-10">Страница не найдена</p>
      <p className="text text_type_main-default text_color_inactive mt-4 mb-10">
        Возможно, вы ошиблись адресом или страница была удалена.
      </p>
      <Link to="/" className={`text text_type_main-default ${styles.link}`}>
        Вернуться на главную
      </Link>
    </div>
  );
};