const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const extractParams = require('./utils/params');
const { buildObjectFromPairs } = require('./utils/build');
const logger = require('./utils/logger');

function main() {
  const defaultParams = {
    inputFile: './file.xlsx',
    outputDir: './imports',
  };
  const userParams = extractParams(process.argv.splice(2));
  const params = {
    ...defaultParams,
    ...userParams,
  };

  const inputFile = path.resolve(__dirname, params.inputFile);
  const outputDir = path.resolve(__dirname, params.outputDir);

  if (!fs.existsSync(inputFile)) {
    logger.error(`File does not exist: ${inputFile}.`);
    return;
  }

  // 高版本 node 应该用 fs.rmSync
  const rmSync = fs.rmSync || fs.rmdirSync;
  rmSync(outputDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    const sheets = xlsx.parse(inputFile);
    const [firstSheet] = sheets;
    const rows = firstSheet.data;
    const sheetResources = {};
    // 遍历 sheet 表格，搜集数据至 sheetResources
    for (let r = 0; r < rows.length; r++) {
      // 无需遍历第一列了
      for (let c = 1; c < rows[r].length; c++) {
        if (r === 0) {
          const name = rows[r][c];
          sheetResources[name] = [];
        } else {
          const path = rows[r][0]; // 文案 key
          const value = rows[r][c]; // 文案 value
          const resourceName = rows[0][c]; // 语言名称
          const resource = sheetResources[resourceName];
          resource.push({ path, value });
        }
      }
    }

    // 得到语言名称以及对应的 js 对象
    const resources = Object.keys(sheetResources).map((resourceName) => ({
      name: resourceName,
      value: buildObjectFromPairs(sheetResources[resourceName]),
    }));

    for (const resource of resources) {
      const { name, value } = resource;
      const resourcePathName = path.resolve(outputDir, name);
      // 创建资源文件夹
      fs.mkdirSync(resourcePathName);
      // 写入 index.js 文件
      fs.writeFileSync(
        path.resolve(resourcePathName, 'index.js'),
        `module.exports = ${JSON.stringify(value)}`
      );
    }

    logger.success(
      `Resources were successfully imported, please checkout ${outputDir}`
    );
  } catch (e) {
    logger.error(e.message);
  }
}

main();
