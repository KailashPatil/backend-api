"use strict";
const SeasonModel = require("./index");

class AsrtPlanningListsModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "assortment_planning_lists";
  }
}

module.exports = AsrtPlanningListsModel;
