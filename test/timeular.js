const assert = require('chai').assert
// const fetchMock = require('fetch-mock')

describe("Timeular API", () => {
  describe("requiring keys", () => {
    it ("should not pass the key validation check", () => {
      process.env.TIMEULAR_API_KEY = null;
      assert.throws(require('../src/timeular/index'), Error, "Missing API Key and Secret. Please provide with environment variables TIMEULAR_API_KEY and TIMEULAR_API_SECRET");
    })
  })
})