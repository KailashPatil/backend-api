"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/../../..");
const Validator = require("./validator");
const Controller = require(srcDir + "/util/controller");

const _ = require("underscore");

class VersionCont extends Controller {
  constructor(server) {
    super(server);
  }
  setupRoutes() {
    this.setupRoute("get", "/version", this.getVersion);
  }

  async getVersion(req, res, next) {
    res.json(200, { version: "0.01" });
    return next();
  }
}

module.exports = VersionCont;
