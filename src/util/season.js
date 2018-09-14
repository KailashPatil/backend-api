"use strict";

const config = require("config");

module.exports = {
  validateSeason: () => {
    return (req, res, next) => {
      let season = req.all_params.season;
      if (season) {
        if (config.has(`season.${season}`)) {
          req.valid_season = true;
          return next();
        }
        let e = new Error(`Invalid season '${season}'`);
        e.code = 400;
        return next(e);
      }
      return next();
    };
  }
};
