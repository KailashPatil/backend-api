"use strict";
const Model = require("../index");

const mongodbService = require("services").mongodbPersistenceService;
const config = require("config");

class BaseModel extends Model {
  constructor() {
    super();

    if (!global.DB_CONNECTIONS["list_db"]) {
      global.DB_CONNECTIONS["list_db"] = new mongodbService({
        db_config: config.get("list_db.mongodb"),
        db_options: {
          connectTimeoutMS: 75000,
          socketTimeoutMS: 75000
        }
      });
    }
    this.persistenceService = global.DB_CONNECTIONS["list_db"];
  }
}

module.exports = BaseModel;
