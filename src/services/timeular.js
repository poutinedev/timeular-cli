const fetch = require("node-fetch");

const cacheService = require("./cache");

const apiKey = process.env.TIMEULAR_API_KEY;
const apiSecret = process.env.TIMEULAR_API_SECRET;

const apiPath = "https://api.timeular.com/api/v3/";
let apiToken;

if (!apiKey || !apiSecret) {
  throw "Missing API Key and Secret. Please provide with environment variables TIMEULAR_API_KEY and TIMEULAR_API_SECRET";
}

const request = async (endpoint, data = {}) => {
  let url = apiPath + endpoint;

  if (data.body) {
    data.body = JSON.stringify(data.body);
  }
  if (!data.headers) {
    data.headers = {};
  }

  if (apiToken) {
    data.headers.Authorization = `Bearer ${apiToken}`;
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
    const data = await request("developer/sign-in", {
      method: "POST",
      body: {
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
    });

    if (!data || !data.token) {
      throw "Could not log in to Public Timeular API";
    }

    apiToken = data.token;
  }
};

const call = async (endpoint, data = {}) => {
  await connectToAPI();

  return request(endpoint, data);
};

const getTimeEntries = async (start, end) => {
  return call(
    `time-entries/${start.format("YYYY-MM-DDTHH:mm:ss.SSS")}/${end.format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    )}`
  );
};

const getTagsAndMentions = async () => {
  let tagsAndMentions = await cacheService.get("tags-and-mentions");
  if (!tagsAndMentions) {
    tagsAndMentions = await call("tags-and-mentions");

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 2); // Cache for 2 hours
    cacheService.set("tags-and-mentions", tagsAndMentions, expiration);
  }

  return tagsAndMentions;
};

const getMentions = async () => {
  const data = await getTagsAndMentions();

  return data.mentions;
};
const getMention = async (key) => {
  const mentions = await getMentions();

  let filtered = mentions.filter((mention) => mention.key == key);
  if (filtered.length > 0) {
    return filtered.pop();
  }

  return null;
};
const getTags = async () => {
  const data = await getTagsAndMentions();

  return data.tags;
};
const getTag = async (key) => {
  const tags = await getTags();

  let filtered = tags.filter((tag) => tag.key == key);
  if (filtered.length > 0) {
    return filtered.pop();
  }

  return null;
};

// @TODO make this so each endpoint is built through the node package instead.
module.exports = {
  call,
  getTimeEntries,
  getMentions,
  getMention,
  getTags,
  getTag,
};
