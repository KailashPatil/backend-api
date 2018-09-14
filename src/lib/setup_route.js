"use strict";
const fs = require("fs");

module.exports = (server, controllerPath) => {
  let files = fs.readdirSync(controllerPath);

  for (let i = 0; i < files.length; i++) {
    if (files[i] === "index.js") {
      continue;
    }

    let controllerClass;
    if (files[i].endsWith(".js")) {
      controllerClass = require(controllerPath + "/" + files[i]);
    } else {
      controllerClass = require(controllerPath + "/" + files[i] + "/index.js");
    }

    let controllerObj = new controllerClass(server);
    controllerObj.setupRoutes();
  }
};
