"use strict";
const SeasonModel = require("./index");

class ExtrasModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "extras";
    this.schema = {
      properties: {
        name: {
          type: "string",
          required: true
        },
        val: {
          type: "string",
          required: true
        }
      }
    };
  }
}

module.exports = ExtrasModel;
