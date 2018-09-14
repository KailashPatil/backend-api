"use strict";
const SeasonModel = require("./index");

class WSLogModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "worker_server_logs";
    this.schema = {
      properties: {
        task: {
          type: "string",
          required: true
        },
        in_params: {
          type: "any",
          required: true
        },
        status: {
          type: "string",
          required: true
        },
        result: {
          type: "any"
        },
        logs: {
          type: "array",
          default: []
        },
        created_date: {
          type: "Date"
        }
      }
    };
  }
}

module.exports = WSLogModel;
