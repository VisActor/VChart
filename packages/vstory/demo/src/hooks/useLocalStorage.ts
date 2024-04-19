import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string, initialValue: string | number) => {
  // 通过传入的key获取localStorage中的值
  const storedValue = localStorage.getItem(key);

  // 使用useState初始化值，如果localStorage中有值则使用，否则使用传入的初始值
  const [value, setValue] = useState(storedValue ? JSON.parse(storedValue) : initialValue);

  // 使用useEffect监听value的变化，并将其存储到localStorage中
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
