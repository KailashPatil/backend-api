"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/..");

const PPModel = require(srcDir + "/model/season/product/published");

const _ = require("underscore");
const config = require("config");

const InitUtil = {
  createCurrentJsonData: () => {
    let seasons = config.get("season");
    for (let s in seasons) {
      let ppModel = new PPModel(s);
      ppModel.createInitCurrentJsonData();
    }
  }
};

module.exports = InitUtil;
