import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const controller = new AbortController();

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getIngredients();
      setIngredients(data.data);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  load();
  return () => controller.abort();
}, []);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <p className="text text_type_main-medium mt-10">
          Не удалось загрузить ингредиенты: {error}
        </p>
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
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
    </div>
  );
};

export default App;