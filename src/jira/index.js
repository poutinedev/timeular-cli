const fetch = require("node-fetch");

const encodedAuth = process.env.JIRA_AUTH;

const apiPath = "https://jira.happycog.com/rest/api/2/";

if (!encodedAuth) {
  throw "Missing Jira Authorization. Include a base64 encoding of 'username:password' to a JIRA_AUTH environment variable.";
}

const callJira = async (endpoint, data = {}) => {
  let url = apiPath + endpoint;

  if (data.body) {
    data.body = JSON.stringify(data.body);
  }

  data.headers = {
    'Content-Type': `application/json`,
    'Authorization': `Bearer ${encodedAuth}`
  };

  const res = await fetch(url, data);
  let parsedRes = await res.json();

  if (!res.ok) {
    throw "[Jira] " + parsedRes.message;
  }

  return parsedRes;
};

// @TODO make this so each endpoint is built through the node package instead.
module.exports = {
  api: async (endpoint, data = {}) => {
    return callJira(endpoint, data);
  }
};
