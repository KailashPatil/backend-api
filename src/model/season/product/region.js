"use strict";
const SeasonModel = require("../index");

class RegionModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "region";
    this.schema = {
      properties: {
        name: { type: "string" },
        display_name: { type: "string" },
        assortment_ids: { type: "array" },
        order: { type: "number" },
        image: { type: "any" }
      }
    };
  }

  list(filters, fields) {
    if (!filters) {
      filters = {};
    }
    if (!filters["sort"]) {
      filters["sort"] = { order: "ASC" };
    }
    return super.list(filters, fields);
  }

  getByName(name) {
    let filter = { name: name };
    return this.get(filter);
  }
}

module.exports = RegionModel;
