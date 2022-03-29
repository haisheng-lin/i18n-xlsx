const logger = {
  /**
   * @param {string} message
   */
  warn(message) {
    console.log('\x1b[43;30m WARNING \x1b[40;33m ' + message + '\x1b[0m');
  },
  /**
   * @param {string} message
   */
  info(message) {
    console.log('\x1b[44;37m INFO \x1b[40;37m ' + message + '\x1b[0m');
  },
  /**
   * @param {string} message
   */
  error(message) {
    console.log('\x1b[41;37m ERROR \x1b[40;31m ' + message + '\x1b[0m');
  },
  /**
   * @param {string} message
   */
  success(message) {
    console.log('\x1b[42;30m SUCCESS \x1b[40;32m ' + message + '\x1b[0m');
  },
};

module.exports = logger;
