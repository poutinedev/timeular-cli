const moment = require("moment");
const dateRegex = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");

module.exports = {
  getRange: (requestedDate = null) => {
    const defaultDate = moment();
    const utcOffset = defaultDate.utcOffset(); // Gets your system's timezone.

    let startDate = defaultDate;
    let endDate = defaultDate;
    if (requestedDate) {
      if (dateRegex.test(requestedDate) === false) {
        throw "Date must be YYYY-MM-DD format";
      }
      startDate = moment(requestedDate);
      endDate = startDate;
    }

    // Gets UTC times, adjusted by the offset.
    const utcStartTime = moment(startDate)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .utc()
      .utcOffset(utcOffset, true);
    const utcEndTime = moment(endDate)
      .hours(23)
      .minutes(59)
      .seconds(59)
      .milliseconds(999)
      .utc()
      .utcOffset(utcOffset, true);

    return { timeStart: utcStartTime, timeEnd: utcEndTime };
  },
  getDuration: (duration) => {
    let dateDifference = moment.utc(
      moment(duration.stoppedAt).diff(moment(duration.startedAt))
    );
    let durationInSeconds = moment.duration(
      parseInt(dateDifference.seconds()) +
        parseInt(dateDifference.minutes()) * 60 +
        parseInt(dateDifference.hours()) * 60 * 60,
      "seconds"
    );

    return parseFloat(durationInSeconds.asHours());
  },
  getDisplay: (date) => {
    return date.format("MMMM Do, YYYY");
  },
};
