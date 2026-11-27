import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { Input, EmailInput, PasswordInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@hooks/use-redux';
import { useUpdateUserMutation } from '@services/api';
import { useForm } from '@hooks/use-form';
import styles from './profile.module.css';

export const ProfileInfoPage = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.user.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { values, handleChange, setValues } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  // Эталонные данные — с ними сравниваем для показа кнопок
  const [initialData, setInitialData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Синхронизация, если user пришёл с задержкой
  useEffect(() => {
    if (user) {
      setInitialData({ name: user.name, email: user.email });
      setValues({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const isChanged = useMemo(
    () =>
      values.name !== initialData.name ||
      values.email !== initialData.email ||
      values.password !== '',
    [values, initialData]
  );

  const handleCancel = () => {
    setValues({ name: initialData.name, email: initialData.email, password: '' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(values).unwrap();
    } catch (err) {
      console.error('Ошибка обновления данных', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        onChange={handleChange}
        value={values.name}
        name="name"
        icon="EditIcon"
      />
      <EmailInput onChange={handleChange} value={values.email} name="email" isIcon={true} />
      <PasswordInput
        onChange={handleChange}
        value={values.password}
        name="password"
        icon="EditIcon"
        placeholder="Пароль"
      />

      {isChanged && (
        <div className={styles.actions}>
          <Button htmlType="button" type="secondary" size="medium" onClick={handleCancel}>
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};