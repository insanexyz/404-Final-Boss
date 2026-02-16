// handle all events in the event folder


const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {

  // __dirname gives current dir from root level
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  console.log(eventFolders);
}