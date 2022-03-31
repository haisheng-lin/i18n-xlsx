const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const extractParams = require('./utils/params');
const {
  getResourcesFromJS,
  getRowsFromResources,
} = require('./utils/resources');
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

    const resources = getResourcesFromJS(inputDir, base);
    const rows = getRowsFromResources(resources);

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
