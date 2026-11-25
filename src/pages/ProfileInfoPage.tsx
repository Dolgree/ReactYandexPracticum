import { useState, useEffect, type FormEvent } from 'react';
import { Input, EmailInput, PasswordInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@hooks/use-redux';
import { useUpdateUserMutation } from '@services/api';
import styles from './profile.module.css';

export const ProfileInfoPage = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.user.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  // "Эталонные" данные (из Redux) — с ними сравниваем
  const [initialData, setInitialData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  //Текущие данные в полях формы
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  //Синхронизируем форму, если данные пользователя пришли с задержкой
  useEffect(() => {
    if (user) {
      setInitialData({ name: user.name, email: user.email });
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    }
  }, [user]);

  // Проверяем, изменена ли форма
  const isChanged =
    name !== initialData.name ||
    email !== initialData.email ||
    password !== '';

  const handleCancel = () => {
    setName(initialData.name);
    setEmail(initialData.email);
    setPassword('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUser({ name, email, password }).unwrap();
      // После успеха Redux обновится через onQueryStarted,
      // и useEffect обновит initialData
    } catch (err) {
      console.error('Ошибка обновления данных', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        onChange={(e) => setName(e.target.value)}
        value={name}
        name="name"
        icon="EditIcon"
      />
      <EmailInput
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name="email"
        isIcon={true}
      />
      <PasswordInput
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        name="password"
        icon="EditIcon"
        placeholder="Пароль"
      />

      {isChanged && (
        <div className={styles.actions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};