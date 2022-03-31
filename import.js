const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const extractParams = require('./utils/params');
const { buildObjectFromPairs } = require('./utils/build');
const { getResourcesFromRows } = require('./utils/resources');
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
    throw new Error(`File does not exist: ${inputFile}.`);
  }

  try {
    const sheets = xlsx.parse(inputFile);
    const [firstSheet] = sheets;
    const rows = firstSheet.data;
    const resources = getResourcesFromRows(rows);

    if (fs.existsSync(outputDir)) {
      // 高版本 node 应该用 fs.rmSync
      const rmSync = fs.rmSync || fs.rmdirSync;
      rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    Object.keys(resources).forEach((language) => {
      const languageResource = resources[language];
      Object.keys(resources[language]).forEach((filePath) => {
        const keyValuePairs = languageResource[filePath];
        const value = buildObjectFromPairs(keyValuePairs);
        const index = filePath.lastIndexOf('/');
        const relativeFilePath = filePath.substring(0, index); // components
        const fileName = filePath.substring(index + 1); // index.js
        const pathName = path.resolve(outputDir, language, relativeFilePath); // outputDir/zh-CN/components
        fs.mkdirSync(pathName, { recursive: true });
        fs.writeFileSync(
          path.resolve(pathName, fileName),
          `module.exports = ${JSON.stringify(value, null, 2)}`
        );
      });
    });

    logger.success(
      `Resources were successfully imported, please checkout ${outputDir}`
    );
  } catch (e) {
    logger.error(e.message);
  }
}

main();
