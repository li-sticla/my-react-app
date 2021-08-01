//@ts-check
// 自定义工具库
import { useEffect, useState } from "react";

/**
 * 布尔类型转换,且排除 value为 0 的特殊情况
 * @date 2021-08-01
 * @param {unknown} value
 * @returns {boolean}
 */
export const isFalsy = (value) => (value === 0 ? false : !value);

/**
 * 清理对象空属性
 * @date 2021-08-01
 * @param {object} object
 * @returns {object}
 */
export const cleanObject = (object) => {
  //在函数里改变传入的对象是不好的行为,Object.assign({},object)仍会发生浅拷贝，不推荐
  const result = JSON.parse(JSON.stringify(object));
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};

/**
 * 利用custom hook实现mount钩子
 * @date 2021-08-01
 * @param {function} callback
 */
export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};

/**
 * 利用custom hook 实现的 debounce
 * @date 2021-08-01
 * @template V
 * @param {V} value
 * @param {number} delay
 * @returns {V}
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // value变化后设定计时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    // 上一个useEffect处理完后执行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
