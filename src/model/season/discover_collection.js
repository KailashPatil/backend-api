"use strict";
const SeasonModel = require("./index");

class DiscoverCollectionModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "discover_collection";
  }
}

module.exports = DiscoverCollectionModel;
