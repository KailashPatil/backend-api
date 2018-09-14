"use strict";
const Model = require("./index");

class TxnLogModel extends Model {
  constructor(season) {
    super(season);
    this.table = "txn_log";
    this.schema = {
      properties: {
        txn_id: {
          type: "String",
          required: true
        },
        txn_action: {
          type: "String",
          required: true
        },
        user: {
          type: "Object",
          required: true
        }
      }
    };
  }
}

module.exports = TxnLogModel;
