"use strict";
const UserModel = require("./index");

const config = require("config");

class APIModel extends UserModel {
  constructor() {
    super();
    this.table = "api";
    this.schema = {
      properties: {
        app_name: {
          type: "string",
          required: true
        },
        api_key: {
          type: "string",
          required: true
        },
        password: {
          type: "string",
          exclusiveMinimum: 10
        },
        is_active: {
          type: "boolean",
          default: false
        }
      }
    };
  }
}

module.exports = APIModel;
