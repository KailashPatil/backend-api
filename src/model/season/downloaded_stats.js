"use strict";
const Model = require("./index");

class DownloadedStatsModel extends Model {
  constructor(season) {
    super(season);
    this.table = "downloaded_stats";
    this.schema = {
      properties: {
        user: {
          type: ["String", "null"],
          default: null
        },
        region: {
          type: "String",
          required: true
        },
        resource: {
          type: "String",
          required: true
        },
        resource_type: {
          type: "String",
          required: true
        },
        size: {
          type: "Number",
          required: true
        },
        time: {
          type: "Number",
          required: true
        },
        other_data: {
          type: "Object"
        }
      }
    };
  }
}

module.exports = DownloadedStatsModel;
