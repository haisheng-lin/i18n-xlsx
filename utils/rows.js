const { isPlainObject, isString } = require('./types');

/**
 * @param {{ name: string, value: object }} base
 * @param {{ name: string, value: object }[]} others
 */
function generateRows(base, others) {
  const rows = [['key', base.name, ...others.map((other) => other.name)]];

  /**
   * @param {any} base
   * @param {any[]} others
   * @param {string} path
   */
  const walker = (base, others, path = '') => {
    if (isPlainObject(base) && others.every((other) => isPlainObject(other))) {
      const keys = Object.keys(base);
      for (const key of keys) {
        walker(
          base[key],
          others.map((other) => other[key]),
          (path ? `${path}.` : '') + key
        );
      }
    } else if (isString(base) && others.every((other) => isString(other))) {
      rows.push([path, base, ...others]);
    } else {
      // 异常情况
    }
  };

  walker(
    base.value,
    others.map((other) => other.value)
  );

  return rows;
}

module.exports = generateRows;
