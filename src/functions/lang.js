module.exports = function (lang) {
  let file = require(`../languages/${lang}.json`);

  if (!file) return "Error 404\nFILE NOT FOUND!";

  return file;
};
