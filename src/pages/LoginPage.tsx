import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EmailInput, PasswordInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useLoginMutation } from '@services/api';
import { useForm } from '@hooks/use-form';
import styles from './auth.module.css';

export const LoginPage = (): React.JSX.Element => {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(values).unwrap();
      const from = (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrorMsg(error?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput onChange={handleChange} value={values.email} name="email" isIcon={false} />
        <PasswordInput onChange={handleChange} value={values.password} name="password" />
        {errorMsg && <p className="text text_type_main-default text_color_error">{errorMsg}</p>}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </Button>
      </form>
      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль? <Link to="/forgot-password" className={styles.link}>Восстановить пароль</Link>
        </p>
      </div>
    </div>
  );
};