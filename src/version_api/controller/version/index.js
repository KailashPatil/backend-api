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
    // this.setupRoute("get", "/version/:id", this.getVersionById);
    this.setupRoute("get", "/version/kp", this.getVersionByName);
  }

  async getVersion(req, res, next) {
    res.json(200, { version: "0.01" });
    return next();
  }

  async getVersionById(req, res, next) {
    console.log(req.params);
    res.json(200, { version: req.params.id});
    return next();
  }

  async getVersionByName(req, res, next) {
    console.log(req.params);
    res.json(200, { version: req.params});
    return next();
  }
}

module.exports = VersionCont;
