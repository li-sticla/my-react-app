// 排除 value为 0 的特殊情况
export const isFalsy = (value) => (value === 0 ? false : !value);
// 在函数里改变传入的对象是不好的行为
export const cleanObject = (object) => {
  // Object.assign({},object)仍会发生浅拷贝，不推荐
  const result = JSON.parse(JSON.stringify(object));
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};
