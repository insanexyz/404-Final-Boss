// handle all events in the event folder


const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {

  // __dirname gives current dir from root level
  // Store all event folders
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  // Loop a event folder and store the files inside it in [] 
  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);

    // Sort events based on names, so we can give priority to some events based on numbers
    eventFiles.sort((a, b) => {
      return a > b;
    });

    // Get event name based on the folder name
    // const eventName = eventFolder.replace(/\\/g, "/").split("/").pop(); // for windows
    const eventName = eventFolder.split("/").pop();


    // loop all the eventFiles for a paritcular event folder and run it finally
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    })
  }
}