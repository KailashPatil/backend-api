"use strict";
const BaseModel = require("./index");

class CountModel extends BaseModel {
  constructor() {
    super();
    this.table = "counts";
  }
}

module.exports = CountModel;
