"use strict";
const md5 = require("md5");
const config = require("config");

module.exports = string => {
  if (!string) {
    throw new Error("Invalid input");
  }
  if (!config.has("salt")) {
    throw new Error("Salt is not configured");
  }
  return md5(string + config.get("salt"));
};
