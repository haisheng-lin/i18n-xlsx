const fs = require('fs');
const path = require('path');
const { buildTargetFromBase } = require('./build');
const { isPlainObject, isString } = require('./types');

/**
 * @param {string} dir
 * @param {string} baseName
 * @returns {{ file: string, base: { name: string, value: object }, others: { name: string, value: object }[] }[]}
 */
function getResourcesFromJS(dir, baseName) {
  // 资源包里可能有嵌套文件夹及文件资源
  // {file base others}[]
  // 以 base 作为基准，只读取 base 有的文件夹及文件，其他资源包没有的文件夹与文件则忽略
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory does not exist: ${dir}.`);
  }
  const baseDir = path.resolve(dir, baseName);
  if (!fs.existsSync(baseDir)) {
    throw new Error(`${baseName} cannot be found in ${dir}.`);
  }

  const result = [];
  const otherNames = fs.readdirSync(dir).filter((name) => name !== baseName);

  /**
   * @param {string} currentPath
   */
  const walker = (currentPath = '') => {
    const entirePath = path.resolve(baseDir, currentPath);
    const isDir = fs.lstatSync(entirePath).isDirectory();
    if (isDir) {
      const children = fs.readdirSync(entirePath);
      for (const child of children) {
        walker(currentPath ? `${currentPath}/${child}` : child);
      }
    } else {
      const baseValue = require(entirePath);
      const others = otherNames.map((otherName) => {
        const otherPath = path.resolve(dir, otherName, currentPath);
        const isExist = fs.existsSync(otherPath);
        const isFile = isExist ? fs.lstatSync(otherPath).isFile() : false;
        const value = isFile ? require(otherPath) : {};

        return {
          name: otherName,
          value: buildTargetFromBase(baseValue, value),
        };
      });
      result.push({
        file: currentPath,
        base: { name: baseName, value: baseValue },
        others,
      });
    }
  };

  walker();

  return result;
}

/**
 * @param {string[][]} rows
 * @returns {{ [language: string]: { [file: string]: { path: string, value: string }[] } }}
 */
function getResourcesFromRows(rows) {
  const resources = {};
  // 遍历 sheet 表格搜集数据
  for (let r = 0; r < rows.length; r++) {
    // 无需遍历前两列了，前两列分别是 file 与 key
    for (let c = 2; c < rows[r].length; c++) {
      if (r === 0) {
        const language = rows[r][c];
        resources[language] = {}; // { [file: string]: { path: string, value: string }[] }
      } else {
        const file = rows[r][0]; // 文件路径
        const path = rows[r][1]; // 文案 key
        const value = rows[r][c]; // 文案 value
        const language = rows[0][c];
        const resource = resources[language]; // 维度是二维的，根据语言与 file 找到对象
        resource[file] = resource[file] || [];
        resource[file].push({ path, value });
      }
    }
  }

  return resources;
}

/**
 * @param {{ file: string, base: { name: string, value: object }, others: { name: string, value: object }[] }[]} resources
 */
function getRowsFromResources(resources) {
  if (!resources || !resources.length) {
    return [];
  }

  const { base, others } = resources[0];

  const rows = [
    ['file', 'key', base.name, ...others.map((other) => other.name)],
  ];

  /**
   * @param {string} file
   * @param {any} base
   * @param {any[]} others
   * @param {string} path
   */
  const walker = (file, base, others, path = '') => {
    if (isPlainObject(base) && others.every((other) => isPlainObject(other))) {
      const keys = Object.keys(base);
      for (const key of keys) {
        walker(
          file,
          base[key],
          others.map((other) => other[key]),
          (path ? `${path}.` : '') + key
        );
      }
    } else if (isString(base) && others.every((other) => isString(other))) {
      rows.push([file, path, base, ...others]);
    } else {
      // 异常情况
    }
  };

  for (const { file, base, others } of resources) {
    walker(
      file,
      base.value,
      others.map((other) => other.value)
    );
  }

  return rows;
}

module.exports = {
  getResourcesFromJS,
  getResourcesFromRows,
  getRowsFromResources,
};
