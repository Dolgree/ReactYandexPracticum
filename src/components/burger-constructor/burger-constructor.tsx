import { useState, useMemo } from 'react';

import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const bun = ingredients.find((item) => item.type === 'bun');
  const fillings = ingredients.filter(
    (item) => item.type === 'main' || item.type === 'sauce'
  );

const totalPrice = useMemo(() => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const fillingsPrice = fillings.reduce((sum, item) => sum + item.price, 0);
  return bunPrice + fillingsPrice;
}, [bun, fillings]);

  return (
    <section className={`${styles.burger_constructor} pt-25 pl-4`}>
      {/* Верхняя булка */}
      {bun && (
        <div className={`${styles.bun} ml-8`}>
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            thumbnail={bun.image_mobile}
            price={bun.price}
          />
        </div>
      )}

      {/* Начинки — скроллятся */}
      <div className={`custom-scroll ${styles.fillings_wrapper}`}>
        <ul className={styles.fillings}>
          {fillings.map((item) => (
            <li key={item._id} className={styles.filling_item}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={item.name}
                thumbnail={item.image_mobile}
                price={item.price}
                handleClose={() => {
                  /* TODO: удаление */
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Нижняя булка */}
      {bun && (
        <div className={`${styles.bun} ml-8`}>
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            thumbnail={bun.image_mobile}
            price={bun.price}
          />
        </div>
      )}

      {/* Футер */}
      <div className={`${styles.footer} mt-10 mr-4`}>
        <span className={`${styles.total} text text_type_digits-medium mr-10`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </span>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={() => setOrderModalOpen(true)}
        >
          Оформить заказ
        </Button>
      </div>

      {isOrderModalOpen && (
        <Modal onClose={() => setOrderModalOpen(false)}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};