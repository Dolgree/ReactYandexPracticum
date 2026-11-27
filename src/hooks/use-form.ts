import { useState, useCallback, type ChangeEvent } from 'react';

export function useForm<T extends Record<string, string>>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);


  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return { values, handleChange, setValues };
}