import type { TIngredient } from '@utils/types';
import {
  CurrencyIcon,
  Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './IngredientsList.module.css';

type TIngredientsListProps = {
  ingredients: TIngredient[];
  title: string;
  onIngredientClick?: (ingredient: TIngredient) => void;
  ref?: React.Ref<HTMLDivElement>;
};

export const IngredientsList = ({
  ingredients,
  title,
  onIngredientClick,
  ref,
}: TIngredientsListProps) => {
  if (ingredients.length === 0) {
    return (
      <p className={`${styles.empty} text text_type_main-default text_color_inactive`}>
        Нет ингредиентов в этой категории
      </p>
    );
  }

  return (
    <div ref={ref} className={styles.section}>
      <h3 className="text text_type_main-medium mb-6">{title}</h3>
      <ul className={`${styles.list} pl-4 pr-4`}>
        {ingredients.map((item) => (
          <li
            key={item._id}
            className={styles.card}
            onClick={() => onIngredientClick?.(item)}
          >
            <Counter count={1} />
            <img
              src={item.image_large}
              alt={item.name}
              className={styles.image}
            />
            <span className={`${styles.price} text text_type_digits-medium mt-1`}>
              {item.price}
              <CurrencyIcon type="primary" />
            </span>
            <span className={`${styles.name} text text_type_main-default mt-1`}>
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};