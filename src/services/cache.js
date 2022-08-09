const fs = require("fs");

const cachePath = "../../cache/";

modules.export = {
  get: async (key) => {
    const fileName = cachePath + key + ".txt";

    try {
      const storedContent = await fs.readFile(fileName, "utf8");

      const content = JSON.parse(storedContent);
      if (!content || !content.expiration) {
        return false;
      }

      console.log(content);
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  set: async (key, data, expiration = null) => {
    if (!expiration) {
      expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 30);
    }

    const fileName = cachePath + key + ".txt";

    const content = {
      expiration,
      data,
    };

    try {
      await fs.writeFile(fileName, JSON.stringify(content));

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};
