"use strict";
const SeasonModel = require("../index");

class AssortmentModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "assortment";
    this.schema = {
      properties: {
        name: { type: "string" },
        display_name: { type: "string" },
        collection_ids: { type: "array" },
        order: { type: "number" },
        image: { type: "string" }
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

  getByIds(ids) {
    let filter = { _id: { $in: ids } };
    return this.list(filter);
  }

  getByNameAndIds(name, ids) {
    let filter = { name: name, _id: { $in: ids } };
    return this.get(filter);
  }
}

module.exports = AssortmentModel;
