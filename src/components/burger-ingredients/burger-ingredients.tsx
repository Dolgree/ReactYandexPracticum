import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { IngredientsList } from '@components/ingredient-list/ingredient-list';
import { Modal } from '@components/modal/modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useModal } from '@hooks/use-modal';
import {
  setSelectedIngredient,
  clearSelectedIngredient,
} from '@services/slices/ingredient-details-slice';

import type { TIngredient } from '@utils/types';
import type { TRootState } from '@services/store';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TTabValue = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const selectedIngredient = useSelector(
    (state: TRootState) => state.ingredientDetails.selectedIngredient
  );

  const [activeTab, setActiveTab] = useState<TTabValue>('bun');
  const { isModalOpen, openModal, closeModal } = useModal();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const buns = useMemo(
    () => ingredients.filter((i) => i.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((i) => i.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((i) => i.type === 'sauce'),
    [ingredients]
  );

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient) => {
      dispatch(setSelectedIngredient(ingredient));
      openModal();
    },
    [dispatch, openModal]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    dispatch(clearSelectedIngredient());
  }, [dispatch, closeModal]);

  const handleTabClick = useCallback(
    (value: TTabValue, ref: React.RefObject<HTMLDivElement | null>) => {
      isProgrammaticScroll.current = true;
      setActiveTab(value);
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    },
    []
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const containerTop = container.getBoundingClientRect().top;

      const sections: Array<{
        value: TTabValue;
        ref: React.RefObject<HTMLDivElement | null>;
      }> = [
        { value: 'bun', ref: bunRef },
        { value: 'main', ref: mainRef },
        { value: 'sauce', ref: sauceRef },
      ];

      let current: TTabValue = 'bun';
      for (const { value, ref } of sections) {
        const el = ref.current;
        if (!el) continue;
        const offset = el.getBoundingClientRect().top - containerTop;
        if (offset <= 10) {
          current = value;
        }
      }

      setActiveTab(current);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav className="mb-10">
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={activeTab === 'bun'}
            onClick={() => handleTabClick('bun', bunRef)}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={activeTab === 'main'}
            onClick={() => handleTabClick('main', mainRef)}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={activeTab === 'sauce'}
            onClick={() => handleTabClick('sauce', sauceRef)}
          >
            Соусы
          </Tab>
        </ul>
      </nav>

      <div
        ref={scrollContainerRef}
        className={`custom-scroll ${styles.ingredients_wrapper}`}
      >
        <IngredientsList
          ref={bunRef}
          ingredients={buns}
          title="Булочки"
          onIngredientClick={handleIngredientClick}
        />
        <IngredientsList
          ref={mainRef}
          ingredients={mains}
          title="Начинки"
          onIngredientClick={handleIngredientClick}
        />
        <IngredientsList
          ref={sauceRef}
          ingredients={sauces}
          title="Соусы"
          onIngredientClick={handleIngredientClick}
        />
      </div>

      {isModalOpen && selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};