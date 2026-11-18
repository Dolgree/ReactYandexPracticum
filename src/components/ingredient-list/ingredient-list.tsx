import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import type { TIngredient } from '@utils/types';
import {
  CurrencyIcon,
  Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { selectIngredientCounts } from '@services/slices/burger-constructor-slice';

import styles from './ingredient-list.module.css';

type TIngredientListProps = {
  ingredients: TIngredient[];
  title: string;
  onIngredientClick?: (ingredient: TIngredient) => void;
  ref?: React.Ref<HTMLDivElement>;
};

type TDragItem = {
  ingredient: TIngredient;
};

const IngredientCard = ({
  ingredient,
  count,
  onClick,
}: {
  ingredient: TIngredient;
  count: number;
  onClick?: (ingredient: TIngredient) => void;
}): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag<
    TDragItem,
    void,
    { isDragging: boolean }
  >({
    type: 'ingredient',
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const setDragRef = (node: HTMLLIElement | null) => {
    dragRef(node);
  };

  return (
    <li
      ref={setDragRef}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick?.(ingredient)}
    >
      {count > 0 && <Counter count={count} />}
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={styles.image}
      />
      <span className={`${styles.price} text text_type_digits-medium mt-1`}>
        {ingredient.price}
        <CurrencyIcon type="primary" />
      </span>
      <span className={`${styles.name} text text_type_main-default mt-1`}>
        {ingredient.name}
      </span>
    </li>
  );
};

export const IngredientsList = ({
  ingredients,
  title,
  onIngredientClick,
  ref,
}: TIngredientListProps): React.JSX.Element => {
  const counts = useSelector(selectIngredientCounts);

  if (ingredients.length === 0) {
    return (
      <p
        className={`${styles.empty} text text_type_main-default text_color_inactive`}
      >
        Нет ингредиентов в этой категории
      </p>
    );
  }

  return (
    <div ref={ref} className={styles.section}>
      <h3 className="text text_type_main-medium mb-6">{title}</h3>
      <ul className={`${styles.list} pl-4 pr-4`}>
        {ingredients.map((item) => (
          <IngredientCard
            key={item._id}
            ingredient={item}
            count={counts[item._id] ?? 0}
            onClick={onIngredientClick}
          />
        ))}
      </ul>
    </div>
  );
};