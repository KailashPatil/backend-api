"use strict";
const Model = require("./index");

class AuditLogModel extends Model {
  constructor(season) {
    super(season);
    this.table = "audit_log";
    this.schema = {
      properties: {
        logged_dt: {
          type: "Date",
          required: true
        },
        user: {
          type: "Object",
          required: true
        },
        remote_address: {
          type: "String"
        },
        path: {
          type: "String",
          required: true
        },
        method: {
          type: "String",
          required: true
        },
        params: {
          type: "Object",
          required: true
        },
        headers: {
          type: "Object",
          required: true
        },
        status_code: {
          type: "number",
          required: true
        },
        response_length: {
          type: "any",
          required: true
        },
        response_time: {
          type: "number",
          required: true
        },
        response: {
          type: "Object",
          required: true
        },
        extra_data: {
          type: "Object"
        },
        txn_id: {
          type: "string"
        }
      }
    };
  }
}

module.exports = AuditLogModel;
