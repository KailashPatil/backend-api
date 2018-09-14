"use strict";
const Model = require("../index");

const mongodbService = require("services").mongodbPersistenceService;
const config = require("config");

class SeasonModel extends Model {
  constructor(season) {
    super();

    if (!global.DB_CONNECTIONS[season]) {
      let configKey = "season." + season + ".mongodb";
      if (config.has(configKey)) {
        global.DB_CONNECTIONS[season] = new mongodbService({
          db_config: config.get(configKey),
          db_options: {
            connectTimeoutMS: 75000,
            socketTimeoutMS: 75000
          }
        });
      } else {
        throw new Error(
          "Season " + season + " mongodb is not configured properly."
        );
      }
    }
    this.persistenceService = global.DB_CONNECTIONS[season];
  }
}

module.exports = SeasonModel;
