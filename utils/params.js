/**
 * 获取参数，参数的格式有如下几种：
 * ['--x=y', '-x=y', 'x=y', 'xxx']
 * 如果满足前三种，那么解析的结果都是 { x: y }
 * 否则都默认为最后一种结果：{ xxx: xxx }
 *
 * 以下为例子：
 * 1. [--a=1, -b=2, --c=3]，返回对象 { a: 1, b: 2, c: 3 }
 * 2. [-a=1, 222, c=3]，返回对象 { a: 1, 222: 222, c: 3 }
 *
 * @param {string[]} args
 */
function extractParams(args) {
  const reg = /^-{0,2}(.*)=(.*)$/; // 满足 --x=y, -x=y, x=y 格式

  return args.reduce((prev, arg) => {
    if (reg.test(arg)) {
      const regResArr = reg.exec(arg);
      if (regResArr && regResArr.length > 1) {
        const [key, val] = regResArr.slice(1); // 忽略掉第一个完整的字符串结果
        prev[key] = val;
      }
    } else {
      prev[arg] = arg;
    }

    return prev;
  }, {});
}

module.exports = extractParams;
