const jiraAPI = require("jira-client");

const jiraHost = process.env.JIRA_HOST || "";
const jiraUsername = process.env.JIRA_USERNAME;
const jiraPassword = process.env.JIRA_PASSWORD;

if (!jiraHost || !jiraUsername || !jiraPassword) {
  throw "Missing Jira Credentials. Please provide with environment variables JIRA_HOST, JIRA_USERNAME, and JIRA_PASSWORD";
}

const getClient = async function () {
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
  const client = getClient();
};

module.exports = {};
