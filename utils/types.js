const toString = Object.prototype.toString;

const isNumber = (value) => toString.call(value) === '[object Number]';

const isString = (value) => toString.call(value) === '[object String]';

const isBoolean = (value) => toString.call(value) === '[object Boolean]';

const isArray = (value) => toString.call(value) === '[object Array]';

const isFunction = (value) => {
  const str = toString.call(value);
  return str === '[object Function]' || str === '[object AsyncFunction]';
};

const isSymbol = (value) => toString.call(value) === '[object Symbol]';

const isUndefined = (value) => value === undefined;

const isNull = (value) => value === null;

const isPlainObject = (value) => {
  return (
    toString.call(value) == '[object Object]' ||
    // if it isn't a primitive value, then it is a common object
    (!isNumber(value) &&
      !isString(value) &&
      !isBoolean(value) &&
      !isArray(value) &&
      !isNull(value) &&
      !isFunction(value) &&
      !isUndefined(value) &&
      !isSymbol(value))
  );
};

module.exports = {
  isNumber,
  isBoolean,
  isString,
  isArray,
  isFunction,
  isSymbol,
  isUndefined,
  isNull,
  isPlainObject,
};
