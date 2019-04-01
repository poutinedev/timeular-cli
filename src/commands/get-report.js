const moment = require("moment");
const timeular = require("../timeular"); // @TODO change this to just 'timeular'

let mentions = [];

const getDate = () => {
  const timeStart = moment().format("YYYY-MM-DDT00:00:00.000");
  const timeEnd = moment().format("YYYY-MM-DDT23:59:59.999");

  return { timeStart, timeEnd };
};

const getMentions = async () => {
  if (mentions) {
    const tagsAndMentions = await timeular.api("tags-and-mentions");

    if (tagsAndMentions) {
      mentions = tagsAndMentions.mentions;
    }
  }

  return mentions;
};

const getMentionDetails = key => {
  getMentions();

  let filtered = mentions.filter(mention => mention.key == key);

  if (filtered.length > 0) {
    return filtered.pop();
  }

  return null;
};

const getDurationInHours = duration => {
  let dateDifference = moment.utc(
    moment(duration.stoppedAt).diff(moment(duration.startedAt))
  );
  let durationInSeconds = moment.duration(
    parseInt(dateDifference.seconds()) +
      parseInt(dateDifference.minutes()) * 60 +
      parseInt(dateDifference.hours()) * 60 * 60,
    "seconds"
  );

  return durationInSeconds.asHours();
};

module.exports = async () => {
  await getMentions();

  const reportOutput = [];
  let grandTotal = 0;
  const { timeStart, timeEnd } = getDate();
  const entries = await timeular.api(`time-entries/${timeStart}/${timeEnd}`);

  if (entries) {
    entries.timeEntries.forEach(entry => {
      const timeSpent = getDurationInHours(entry.duration);
      entry.note.mentions.forEach(mention => {
        let mentionDetails = getMentionDetails(mention.key);
        if (!reportOutput[mentionDetails.label]) {
          reportOutput[mentionDetails.label] = 0;
        }

        reportOutput[mentionDetails.label] += parseFloat(timeSpent.toFixed(2));
        grandTotal += parseFloat(timeSpent.toFixed(2));
      });
    });
  }

  console.table(reportOutput);
  console.log("Total Hours: ", grandTotal);
};
