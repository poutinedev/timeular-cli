const timeular = require("../timeular");

let mentions = null;

module.exports = {
  prep: async () => {
    if (!mentions) {
      const tagsAndMentions = await timeular.api("tags-and-mentions");

      if (tagsAndMentions) {
        mentions = tagsAndMentions.mentions;
      }
    }

    return mentions;
  },
  getDetails: (key) => {
    if (!mentions) {
      throw "Must run mentions.prep() before calling for Details. No results found.";
    }

    let filtered = mentions.filter(mention => mention.key == key);
    if (filtered.length > 0) {
      return filtered.pop();
    }

    return null;
  }
};