import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TConstructorIngredient } from '@services/slices/burger-constructor-slice';

import styles from './burger-constructor.module.css';

type TFillingItemProps = {
  ingredient: TConstructorIngredient;
  index: number;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

type TDragItem = {
  id: string;
  index: number;
};

export const FillingItem = ({
  ingredient,
  index,
  onRemove,
  onMove,
}: TFillingItemProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<
    TDragItem,
    void,
    { isDragging: boolean }
  >({
    type: 'constructor-ingredient',
    item: { id: ingredient.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop<
    TDragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: 'constructor-ingredient',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  dragRef(dropRef(ref));

  return (
    <li
      ref={ref}
      className={styles.filling_item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        thumbnail={ingredient.image_mobile}
        price={ingredient.price}
        handleClose={() => onRemove(ingredient.id)}
      />
    </li>
  );
};