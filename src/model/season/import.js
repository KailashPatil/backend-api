"use strict";
const SeasonModel = require("./index");

class ImportModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "import";
    this.schema = {
      properties: {
        collection_name: { type: "string" },
        file_name: { type: "string" },
        item_ids: { type: "array" }
      },
      allowed_additional_properties: true
    };
  }
}

module.exports = ImportModel;
