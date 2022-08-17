/* eslint no-console: 0 */

const cacheService = require("../services/cache");

module.exports = async () => {
  try {
    const result = await cacheService.clearAll();

    if (!result) {
      throw "Could not clear cache";
    }

    console.log("Cache cleared successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
