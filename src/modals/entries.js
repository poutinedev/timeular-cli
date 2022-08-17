const timeular = require("../services/timeular");
const dateModal = require("../modals/date");

const getEntries = async (timeStart, timeEnd) => {
  // Get all Entries, with proper Mention details
  const entries = await timeular.getTimeEntries(timeStart, timeEnd);
  const mentions = await timeular.getMentions();
  // const tags = await timeular.getTags();

  if (entries && entries.timeEntries) {
    return entries.timeEntries.map((entry) => {
      entry.hoursSpent = dateModal.getDuration(entry.duration);
      entry.note.mentions = entry.note.mentions.map((mention) => {
        mention.details = mentions
          .filter((filter) => filter.key == mention.key)
          .pop();

        return mention;
      });

      // entry.note.tags = entry.note.tags.map((tag) => {
      //   tag.details = tags.filter((filter) => filter.key == tag.key).pop();

      //   return tag;
      // });

      return entry;
    });
  }

  return false;
};

const getEntry = async (key) => {
  throw "Incomplete function: getEntry - " + key;
};

module.exports = {
  getEntries,
  getEntry,
};
