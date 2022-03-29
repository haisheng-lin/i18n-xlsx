const { isPlainObject, isString } = require('./types');

/**
 * 输出与 base 一模一样的对象格式，并且叶子的值优先取 target 的，否则置空
 *
 * example:
 * 输入 base = { a: '1', b: '2', c: { d: '3' } }, target = { a: 'a' }
 * 输出 { a: 'a', b: '', c: { d: '' } }
 */
function buildTargetFromBase(base, target) {
  if (isPlainObject(base)) {
    return Object.keys(base).reduce((prev, key) => {
      prev[key] = buildTargetFromBase(
        base[key],
        isPlainObject(target) ? target[key] : ''
      );
      return prev;
    }, {});
  } else if (isString(base)) {
    return isString(target) ? target : '';
  }
}

/**
 * example:
 * 输入 [{ path: 'a.b.c', value: '1' }, { path: 'a.c', value: '2' }]
 * 输出 { a: { b: { c: '1' }, c: '2' } }
 *
 * @param {{ path: string, value: string }[]} pairs
 */
function buildObjectFromPairs(pairs) {
  const result = {};

  for (const pair of pairs) {
    let pointer = result;
    const { path, value } = pair;
    const keys = path.split('.');
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        // 叶子
        pointer[key] = value;
      } else {
        pointer[key] = pointer[key] || {};
        pointer = pointer[key];
      }
    }
  }

  return result;
}

module.exports = {
  buildTargetFromBase,
  buildObjectFromPairs,
};
