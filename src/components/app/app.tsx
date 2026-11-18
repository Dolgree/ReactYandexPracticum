import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useGetIngredientsQuery } from '@services/api';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { data, isLoading, isError, error } = useGetIngredientsQuery();

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (isError || !data) {
    const message =
      error && 'status' in error
        ? `Ошибка сервера: ${error.status}`
        : 'Не удалось загрузить ингредиенты';

    return (
      <div className={styles.app}>
        <AppHeader />
        <p className="text text_type_main-medium mt-10">{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className="text text_type_main-large mt-10 mb-5 pl-5">
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={data.data} />
        <BurgerConstructor />
      </main>
    </div>
  );
};

export default App;