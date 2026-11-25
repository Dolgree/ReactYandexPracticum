import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useGetIngredientsQuery } from '@services/api';

import styles from '../components/app/app.module.css'; 

export const HomePage = (): React.JSX.Element => {
  const { data, isLoading, isError, error } = useGetIngredientsQuery();

  if (isLoading) {
    return (
      <div className="mt-20">
        <Preloader />
      </div>
    );
  }

  if (isError || !data) {
    const message =
      error && 'status' in error
        ? `Ошибка сервера: ${error.status}`
        : 'Не удалось загрузить ингредиенты';

    return <p className="text text_type_main-medium mt-10">{message}</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text text_type_main-large mt-10 mb-5 pl-5">
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
    </DndProvider>
  );
};