const jiraAPI = require("jira-client");
const cache = require("./cache");
const cacheService = require("./cache");

const jiraHost = process.env.JIRA_HOST || "";
const jiraUsername = process.env.JIRA_USERNAME;
const jiraPassword = process.env.JIRA_PASSWORD;

const getClient = function () {
  if (!jiraHost || !jiraUsername || !jiraPassword) {
    throw "Missing Jira Credentials. Please provide with environment variables JIRA_HOST, JIRA_USERNAME, and JIRA_PASSWORD";
  }

  return new jiraAPI({
    protocol: "https",
    host: jiraHost,
    username: jiraUsername,
    password: jiraPassword,
    apiVersion: "2",
    strictSSL: true,
  });
};

const getTask = async function (id) {
  try {
    const client = getClient();
    const issue = await client.findIssue(id);
    cache.set(id, issue);

    return issue;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  getTask
};
