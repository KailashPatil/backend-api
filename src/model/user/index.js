"use strict";
const Model = require("../index");

const mongodbService = require("services").mongodbPersistenceService;
const config = require("config");

class UserModel extends Model {
  constructor() {
    super();

    if (!global.DB_CONNECTIONS["app_users"]) {
      global.DB_CONNECTIONS["app_users"] = new mongodbService({
        db_config: config.get("app_users.mongodb"),
        db_options: {
          connectTimeoutMS: 75000,
          socketTimeoutMS: 75000
        }
      });
    }
    this.persistenceService = global.DB_CONNECTIONS["app_users"];
  }
}

module.exports = UserModel;
