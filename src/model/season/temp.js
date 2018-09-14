"use strict";
const SeasonModel = require("./index");

class TempModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "temp";
    this.schema = {
      properties: {
        val: { type: "object" },
        temp_file_name: { type: "string" }
      }
    };
  }
}

module.exports = TempModel;
