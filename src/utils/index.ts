// 自定义工具库
import { useEffect, useRef, useState } from "react";

/**
 * 布尔类型转换,且排除 value为 0 的特殊情况
 * @param {unknown} value
 */
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

/**
 * 判断值有无意义
 * @param {unknown} value
 */
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
/**
 * 清理对象空属性
 * @param {object} object
 * @returns {object}
 */

export const cleanObject = (object?: { [key: string]: unknown }) => {
  if (!object) {
    return {};
  }
  //在函数里改变传入的对象是不好的行为,Object.assign({},object)仍会发生浅拷贝，不推荐
  const result = JSON.parse(JSON.stringify(object));
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

/**
 * 利用custom hook实现mount钩子
 * @param {function} callback
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * 利用custom hook 实现的 debounce
 * @template V
 * @param {V} value
 * @param {number} delay
 * @returns {V} debouncedValue
 */
export const useDebounce = <V>(value: V, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // value变化后设定计时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    // 上一个useEffect处理完后执行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 设置页面标题
 * @param {string} title
 * @param {boolean} keepOnUnmount 卸载后保持标题不变
 */
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

/**
 * 重置为根路由
 */
export const resetRoute = () => (window.location.href = window.location.origin);
