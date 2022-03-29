const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const generateRows = require('./utils/rows');
const extractParams = require('./utils/params');
const { buildTargetFromBase } = require('./utils/build');
const logger = require('./utils/logger');

function main() {
  try {
    const defaultParams = {
      base: 'zh-CN',
      inputDir: './exports',
      outputFileName: 'file',
      sheetName: 'i18n',
    };
    const userParams = extractParams(process.argv.splice(2));
    const params = {
      ...defaultParams,
      ...userParams,
    };
    const { base, sheetName } = params;
    const inputDir = path.resolve(__dirname, params.inputDir);
    const outputFileName = path.resolve(__dirname, params.outputFileName);

    if (!fs.existsSync(inputDir)) {
      logger.error(`Directory does not exist: ${inputDir}.`);
      return;
    }

    const resources = fs.readdirSync(inputDir).map((fileName) => ({
      name: fileName,
      value: require(path.resolve(inputDir, fileName)),
    }));

    const baseResource = resources.find((resource) => resource.name === base);

    if (!baseResource) {
      logger.error(`Cannot resolve ${base} in ${inputDir}.`);
      return;
    }

    const otherResources = resources
      .filter((resource) => resource.name !== base)
      .map((resource) => ({
        name: resource.name,
        value: buildTargetFromBase(baseResource.value, resource.value),
      }));

    const rows = generateRows(baseResource, otherResources);

    const buffer = xlsx.build([
      {
        name: sheetName,
        data: rows,
      },
    ]);

    const outputFilePath = path.resolve(__dirname, `${outputFileName}.xlsx`);
    fs.writeFileSync(outputFilePath, buffer);
    logger.success(`File was successfully exported: ${outputFilePath}`);
  } catch (e) {
    logger.error(e.message);
  }
}

main();
