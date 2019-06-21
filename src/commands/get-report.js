const moment = require("moment");
const timeular = require("../timeular"); // @TODO change this to just 'timeular'

let mentions = null;

const getDate = () => {
  const utcOffset = moment().utcOffset(); // Gets your system's timezone.

  // Gets UTC times, adjusted by the offset.
  const timeStart = moment()
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .utc()
    .utcOffset(utcOffset, true);
  const timeEnd = moment()
    .hours(23)
    .minutes(59)
    .seconds(59)
    .milliseconds(999)
    .utc()
    .utcOffset(utcOffset, true);

  return { timeStart, timeEnd };
};

const getMentions = async () => {
  if (!mentions) {
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
  const entries = await timeular.api(
    `time-entries/${timeStart.format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    )}/${timeEnd.format("YYYY-MM-DDTHH:mm:ss.SSS")}`
  );

  if (entries) {
    entries.timeEntries.forEach(entry => {
      const timeSpent = getDurationInHours(entry.duration).toFixed(2);
      entry.note.mentions.forEach(mention => {
        let mentionDetails = getMentionDetails(mention.key);
        if (!reportOutput[mentionDetails.label]) {
          reportOutput[mentionDetails.label] = 0;
        }

        reportOutput[mentionDetails.label] += parseFloat(timeSpent);
        grandTotal += parseFloat(timeSpent);
      });
    });
  }

  console.table(reportOutput);
  console.log("Total Hours: ", grandTotal);
};
