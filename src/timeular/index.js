const fetch = require("node-fetch");

const apiKey = process.env.TIMEULAR_API_KEY;
const apiSecret = process.env.TIMEULAR_API_SECRET;

const apiPath = "https://api.timeular.com/api/v2/";
let apiToken;

if (!apiKey || !apiSecret) {
  throw "Missing API Key and Secret. Please provide with environment variables TIMEULAR_API_KEY and TIMEULAR_API_SECRET";
}

const callTimeular = async (endpoint, data = {}) => {
  let url = apiPath + endpoint;

  if (data.body) {
    data.body = JSON.stringify(data.body);
  }
  if (!data.headers) {
    data.headers = {};
  }

  if (apiToken) {
    data.headers = {
      Authorization: `Bearer ${apiToken}`
    };
  }

  const res = await fetch(url, data);
  let parsedRes = await res.json();

  if (!res.ok) {
    throw "[Timeular] " + parsedRes.message;
  }

  return parsedRes;
};

const connectToAPI = async () => {
  if (!apiToken) {
    const data = await callTimeular("developer/sign-in", {
      method: "POST",
      body: {
        apiKey: apiKey,
        apiSecret: apiSecret
      }
    });

    if (!data || !data.token) {
      throw "Could not log in to Public Timeular API";
    }

    apiToken = data.token;
  }
};

// @TODO make this so each endpoint is built through the node package instead.
module.exports = {
  api: async (endpoint, data = {}) => {
    await connectToAPI();

    return callTimeular(endpoint, data);
  }
};
