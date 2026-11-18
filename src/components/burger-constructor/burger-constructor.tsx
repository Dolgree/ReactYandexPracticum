import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';

import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useModal } from '@hooks/use-modal';
import { useCreateOrderMutation } from '@services/api';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectTotalPrice,
} from '@services/slices/burger-constructor-slice';

import { FillingItem } from './filling-item';

import type { TIngredient } from '@utils/types';
import type { TRootState } from '@services/store';

import styles from './burger-constructor.module.css';

type TDragItem = {
  ingredient: TIngredient;
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector(
    (state: TRootState) => state.burgerConstructor
  );
  const totalPrice = useSelector(selectTotalPrice);

  const { isModalOpen, openModal, closeModal } = useModal();
  const [createOrder, { data: orderData }] = useCreateOrderMutation();

  // Зона для булок — принимает только bun
  const [{ isOverBun }, bunDropRef] = useDrop<
    TDragItem,
    void,
    { isOverBun: boolean }
  >({
    accept: 'ingredient',
    canDrop: (item) => item.ingredient.type === 'bun',
    drop: (item) => {
      dispatch(addIngredient(item.ingredient));
    },
    collect: (monitor) => ({
      isOverBun: monitor.isOver() && monitor.canDrop(),
    }),
  });

  // Зона для начинок — принимает всё, кроме bun
  const [{ isOverFilling }, fillingDropRef] = useDrop<
    TDragItem,
    void,
    { isOverFilling: boolean }
  >({
    accept: 'ingredient',
    canDrop: (item) => item.ingredient.type !== 'bun',
    drop: (item) => {
      dispatch(addIngredient(item.ingredient));
    },
    collect: (monitor) => ({
      isOverFilling: monitor.isOver() && monitor.canDrop(),
    }),
  });

  const setBunDropRef = useCallback(
    (node: HTMLElement | null) => {
      bunDropRef(node);
    },
    [bunDropRef]
  );

  const setFillingDropRef = useCallback(
    (node: HTMLElement | null) => {
      fillingDropRef(node);
    },
    [fillingDropRef]
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeIngredient(id));
    },
    [dispatch]
  );

  const handleMove = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  const handleOpenOrder = useCallback(async () => {
    if (!bun) return;

    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];

    try {
      await createOrder({ ingredients: ids }).unwrap();
      openModal();
      dispatch(clearConstructor());
    } catch (err) {
      console.error('Ошибка создания заказа:', err);
    }
  }, [bun, ingredients, createOrder, openModal, dispatch]);

  return (
    <section
      ref={setBunDropRef}
      className={`${styles.burger_constructor} pt-25 pl-4`}
    >
      {/* Верхняя булка */}
      {bun ? (
        <div className={`${styles.bun} ml-8`}>
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            thumbnail={bun.image_mobile}
            price={bun.price}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.placeholder_top} ml-8 ${
            isOverBun ? styles.placeholder_active : ''
          }`}
        >
          <span className="text text_type_main-default text_color_inactive">
            Перетащите булку сюда
          </span>
        </div>
      )}

      {/* Начинки */}
      <div
        ref={setFillingDropRef}
        className={`custom-scroll ${styles.fillings_wrapper}`}
      >
        <ul className={styles.fillings}>
          {ingredients.length === 0 ? (
            <li
              className={`${styles.placeholder} ${
                isOverFilling ? styles.placeholder_active : ''
              }`}
            >
              <span className="text text_type_main-default text_color_inactive">
                Перетащите начинки и соусы сюда
              </span>
            </li>
          ) : (
            ingredients.map((item, index) => (
              <FillingItem
                key={item.id}
                ingredient={item}
                index={index}
                onRemove={handleRemove}
                onMove={handleMove}
              />
            ))
          )}
        </ul>
      </div>

      {/* Нижняя булка */}
      {bun ? (
        <div className={`${styles.bun} ml-8`}>
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            thumbnail={bun.image_mobile}
            price={bun.price}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.placeholder_bottom} ml-8 ${
            isOverBun ? styles.placeholder_active : ''
          }`}
        >
          <span className="text text_type_main-default text_color_inactive">
            Перетащите булку сюда
          </span>
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
          onClick={handleOpenOrder}
          disabled={!bun}
        >
          Оформить заказ
        </Button>
      </div>

      {isModalOpen && orderData && (
        <Modal onClose={closeModal}>
          <OrderDetails orderNumber={orderData.order.number} />
        </Modal>
      )}
    </section>
  );
};