"use strict";
const SeasonModel = require("../index");

class CollectionModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "collection";
    this.schema = {
      properties: {
        name: { type: "string" },
        display_name: { type: "string" },
        item_ids: { type: "array" },
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

module.exports = CollectionModel;
