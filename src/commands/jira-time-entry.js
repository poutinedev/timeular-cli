const getReportAction = require("../actions/get-report");
const jiraService = require("../services/jira");
const prompt = require("prompt-sync");

module.exports = async (startDate) => {
  try {
    const data = await getReportAction(startDate);

    const taskIDs = Object.keys(data.reportData);
    if (!data || taskIDs.length == 0) {
      throw "No billable entries found";
    }

    taskIDs.forEach((taskID) => {
      // Is taskID a valid Task?
      // if not, throw warning, and continue.
      // if it is, let's ask for a description.
      // attempt to submit.
      // if Error, repeat.
      // if Success, continue
    });
  } catch (error) {
    console.error(error);
  }
};
