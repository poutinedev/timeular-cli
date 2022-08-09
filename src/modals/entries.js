const timeular = require("../services/timeular");
const dateModal = require("../modals/date");

const getEntries = async (timeStart, timeEnd) => {
  // Get all Entries, with proper Mention details
  const entries = await timeular.getTimeEntries(timeStart, timeEnd);

  if (entries && entries.timeEntries) {
    return entries.timeEntries.map((entry) => {
      entry.hoursSpent = dateModal.getDuration(entry.duration);
      entry.note.mentions = entry.note.mentions.map((mention) => {
        mention.details = timeular.getMention(mention.key);

        return mention;
      });

      entry.note.tags = entry.note.tags.map((tag) => {
        tag.details = timeular.getTag(tag.key);

        return tag;
      });

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
