const fs = require("fs");
const path = require("path");

const cachePath = __dirname + "/../../cache/";

module.exports = {
  get: async function(key) {
    const fileName = cachePath + key + ".json";

    try {
      if (!fs.existsSync(fileName)) {
        return false;
      }

      const storedContent = fs.readFileSync(fileName, "utf8");

      const content = JSON.parse(storedContent);
      if (!content || !content.expiration) {
        return false;
      }

      const currentDate = new Date();
      const expirationDate = new Date(content.expiration);

      if (expirationDate < currentDate) {
        return false;
      }

      return content.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  set: async function(key, data, expiration = null) {
    if (!expiration) {
                       expiration = new Date();
                       expiration.setMinutes(
                         expiration.getMinutes() + 30
                       );
                     }
    const fileName = cachePath + key + ".json";
    const content = {
      expiration,
      data,
    };
    try {
      const jsonData = JSON.stringify(content);
      await fs.writeFileSync(fileName, jsonData);
      return content;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  clear: async function(key) {
    const fileName = cachePath + key + ".json";
    try {
      if (!fs.existsSync(fileName)) {
        return false;
      }

      fs.unlinkSync(fileName);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  clearAll: async function() {
    try {
      await fs.readdir(cachePath, (err, files) => {
        if (err) {
          throw err;
        } else {
          files.forEach((file) => {
            if (path.extname(file) == ".json") {
              let fileName = cachePath + file;
              fs.unlinkSync(fileName);
            }
          });
        }
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};
