const moment = require("moment");
const timeular = require("../timeular"); // @TODO change this to just 'timeular'

let issues = [];

const getDate = () => {
  const timeStart = moment().format("YYYY-MM-DDT00:00:00.000");
  const timeEnd = moment().format("YYYY-MM-DDT23:59:59.999");

  return { timeStart, timeEnd };
};

const getMentions = async () => {
  if (issues) {
    const tagsAndMentions = await timeular.api("tags-and-mentions");

    if (tagsAndMentions) {
      issues = tagsAndMentions.mentions;
    }
  }

  return issues;
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

const getMentionKey = async label => {
  await getMentions();

  const results = issues.filter(
    issue => issue.label.toLowerCase() == label.toLowerCase()
  );

  if (results.length > 0) {
    return results[0].key;
  }

  return null;
};

module.exports = async mention => {
  const mentionKey = await getMentionKey(mention);
  if (!mentionKey) {
    console.warn(
      "Mention is invalid. You have no entries flagged with this @ Mention"
    );
    return;
  }

  const { timeStart, timeEnd } = getDate();

  const entries = await timeular.api(`time-entries/${timeStart}/${timeEnd}`);

  let sum = 0;
  entries.timeEntries.forEach(entry => {
    const hasMention = entry.note.mentions.filter(
      mention => mention.key == mentionKey
    );
    if (hasMention.length > 0) {
      sum += parseFloat(getDurationInHours(entry.duration).toFixed(2));
    }
  });

  console.log(sum);
};
