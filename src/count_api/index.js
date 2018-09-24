"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/..");

const SetupRoute = require(srcDir + "/lib/setup_route");

module.exports = server => {
  let controllerPath = __dirname + "/controller";
  SetupRoute(server, controllerPath);
};
