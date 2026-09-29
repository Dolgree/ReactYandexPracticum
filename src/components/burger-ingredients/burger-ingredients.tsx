import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { IngredientsList } from '@/services/ingridienServices';
import { Modal } from '@components/modal/modal';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TTabValue = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<TTabValue>('bun');
  const [selectedIngredient, setSelectedIngredient] =
    useState<TIngredient | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sauceRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const buns = useMemo(() => ingredients.filter((i) => i.type === 'bun'),
  [ingredients]
);
const mains = useMemo(() => ingredients.filter((i) => i.type === 'main'),
  [ingredients]
);
const sauces = useMemo(() => ingredients.filter((i) => i.type === 'sauce'),
  [ingredients]
);

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
          onIngredientClick={setSelectedIngredient}
        />
        <IngredientsList
          ref={mainRef}
          ingredients={mains}
          title="Начинки"
          onIngredientClick={setSelectedIngredient}
        />
        <IngredientsList
          ref={sauceRef}
          ingredients={sauces}
          title="Соусы"
          onIngredientClick={setSelectedIngredient}
        />
      </div>

      {selectedIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => setSelectedIngredient(null)}
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};