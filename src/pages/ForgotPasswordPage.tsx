import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmailInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useForgotPasswordMutation } from '@services/api';
import { useForm } from '@hooks/use-form';
import styles from './auth.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const { values, handleChange } = useForm({ email: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await forgotPassword(values).unwrap();
      localStorage.setItem('resetPasswordSent', 'true');
      navigate('/reset-password');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrorMsg(error?.data?.message || 'Ошибка при восстановлении пароля');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          onChange={handleChange}
          value={values.email}
          name="email"
          placeholder="Укажите e-mail"
          isIcon={false}
        />
        {errorMsg && <p className="text text_type_main-default text_color_error">{errorMsg}</p>}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Восстановить'}
        </Button>
      </form>
      <p className="text text_type_main-default text_color_inactive mt-20">
        Вспомнили пароль? <Link to="/login" className={styles.link}>Войти</Link>
      </p>
    </div>
  );
};