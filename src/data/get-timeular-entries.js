const timeular = require("../timeular"); // @TODO change this to just 'timeular'
const date = require("../data/get-date");
const getMentions = require("../data/get-timeular-mentions");

module.exports = async (timeStart, timeEnd) => {
  let entries = await timeular.api(
  `time-entries/${timeStart.format(
    "YYYY-MM-DDTHH:mm:ss.SSS"
  )}/${timeEnd.format("YYYY-MM-DDTHH:mm:ss.SSS")}`);

  if (entries) {
    return entries.timeEntries.map(entry => {
      entry.hoursSpent = date.getDuration(entry.duration);
      entry.note.mentions = entry.note.mentions.map(mention => {
        mention.details = getMentions.details(mention.key);

        return mention;
      });

      return entry;
    });
  }

  return false;
};