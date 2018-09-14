"use strict";
const UserModel = require("./index");

const config = require("config");

class AppUserModel extends UserModel {
  constructor() {
    super();
    this.table = "app_users";
    this.schema = {
      properties: {
        email: {
          type: "string",
          required: true
        },
        password: {
          type: "string",
          minimum: 4,
          messages: {
            minimum: "Password should have atleast 4 characters."
          }
        },
        region_name: {
          type: "string",
          required: true
        },
        first_name: {
          type: "string",
          minLength: 1
        },
        last_name: {
          type: "string",
          minLength: 1
        },
        is_active: {
          type: "boolean",
          default: false
        },
        email_verification_status: {
          type: "string"
        },
        hash: {
          type: "string"
        },
        hash_created_time: {
          type: "number"
        },
        is_logged_in: {
          type: "object"
        }
      }
    };
  }

  getByUserId(userId) {
    let filter = { _id: userId };
    return this.get(filter);
  }
}

module.exports = AppUserModel;
