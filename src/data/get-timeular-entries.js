const timeular = require("../timeular"); // @TODO change this to just 'timeular'

module.exports = async (timeStart, timeEnd) => {
  let results = await timeular.api(
  `time-entries/${timeStart.format(
    "YYYY-MM-DDTHH:mm:ss.SSS"
  )}/${timeEnd.format("YYYY-MM-DDTHH:mm:ss.SSS")}`);

  return results;
};