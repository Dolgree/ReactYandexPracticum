import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, PasswordInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useResetPasswordMutation } from '@services/api';
import styles from './auth.module.css';

export const ResetPasswordPage = (): React.JSX.Element | null => {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const isAllowed = localStorage.getItem('resetPasswordSent');
    if (!isAllowed) {
      navigate('/forgot-password', { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await resetPassword({ password, token: code }).unwrap();
      localStorage.removeItem('resetPasswordSent');
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrorMsg(error?.data?.message || 'Ошибка сброса пароля');
    }
  };

  if (isChecking) return null;

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name="password"
          placeholder="Введите новый пароль"
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          onChange={(e) => setCode(e.target.value)}
          value={code}
          name="code"
        />
        {errorMsg && (
          <p className="text text_type_main-default text_color_error">{errorMsg}</p>
        )}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Сохранить'}
        </Button>
      </form>
      <p className="text text_type_main-default text_color_inactive mt-20">
        Вспомнили пароль? <Link to="/login" className={styles.link}>Войти</Link>
      </p>
    </div>
  );
};