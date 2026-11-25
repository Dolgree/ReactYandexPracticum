import { useParams } from 'react-router-dom';
import { useGetIngredientsQuery } from '@services/api';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetIngredientsQuery();

  if (isLoading) return <Preloader />;

  const ingredient = data?.data.find((i) => i._id === id);

  if (!ingredient) {
    return <p className="text text_type_main-medium mt-10">Ингредиент не найден</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
};