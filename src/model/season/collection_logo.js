"use strict";
const SeasonModel = require("./index");

class CollectionLogoModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "collection_logo";
  }
}

module.exports = CollectionLogoModel;
