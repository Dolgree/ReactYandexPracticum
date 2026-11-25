import { useParams, useNavigate } from 'react-router-dom';
import { useGetIngredientsQuery } from '@services/api';
import { Modal } from '@components/modal/modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

export const IngredientModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetIngredientsQuery();

  const handleClose = () => {
    navigate(-1); // Возврат на шаг назад (закрывает модалку)
  };

  if (isLoading) return <Preloader />;
  if (!data) return null;

  const ingredient = data.data.find((i) => i._id === id);
  if (!ingredient) return null;

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};