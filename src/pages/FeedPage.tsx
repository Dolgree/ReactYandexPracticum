import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-10">Лента заказов</h1>
      <p className="text text_type_main-medium mt-20">
        Страница «Лента заказов» находится в разработке
      </p>
    </div>
  );
};