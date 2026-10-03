import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const modalRoot = document.getElementById('modals') as HTMLElement;

export const Modal = ({
  title,
  onClose,
  children,
}: TModalProps): React.JSX.Element => {
const handleEsc = useCallback(
  (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  },
  [onClose]
);

useEffect(() => {
  document.addEventListener('keydown', handleEsc);
  return () => document.removeEventListener('keydown', handleEsc);
}, [handleEsc]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />

      <div className={styles.modal}>
        <header className={`${styles.header} mt-10 ml-10 mr-10`}>
          {title && (
            <h2 className="text text_type_main-large">{title}</h2>
          )}
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </header>

        <div className={`${styles.content} mt-4 mb-15 ml-10 mr-10`}>
          {children}
        </div>
      </div>
    </>,
    modalRoot
  );
};