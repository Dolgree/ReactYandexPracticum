import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, EmailInput, PasswordInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useRegisterMutation } from '@services/api';
import { useForm } from '@hooks/use-form';
import styles from './auth.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register(values).unwrap();
      navigate('/', { replace: true });
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="text" placeholder="Имя" onChange={handleChange} value={values.name} name="name" />
        <EmailInput onChange={handleChange} value={values.email} name="email" isIcon={false} />
        <PasswordInput onChange={handleChange} value={values.password} name="password" />
        {errorMsg && <p className="text text_type_main-default text_color_error">{errorMsg}</p>}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </form>
      <p className="text text_type_main-default text_color_inactive mt-20">
        Уже зарегистрированы? <Link to="/login" className={styles.link}>Войти</Link>
      </p>
    </div>
  );
};