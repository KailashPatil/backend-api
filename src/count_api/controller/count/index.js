"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/../../..");
const APIDir = path.resolve(__dirname + "/../..");
const CountBL = require(APIDir + "/business_logic/count");
// const Validator = require("./validator");
const Controller = require(srcDir + "/util/controller");

const _ = require("underscore");
const mask = require("json-mask");
const config = require("config");

class CountCont extends Controller {
	constructor(server) {
    super(server);
  }

  setupRoutes() {
    this.setupRoute("get", "/counts", this.getCounts);
    this.setupRoute("post", "/counts-post", this.getPostCounts);
  }

  async getCounts(req, res, next) {
		let countBl = new CountBL();
		let countsss = await countBl.getCounts();

		// if (!_.isEmpty(fields)) {
		// 	lists.data = mask(lists.data, fields);
		// }
		res.json(200, countsss);
		return next();
  }

  async getPostCounts(req, res, next) {
		let countBl = new CountBL();
		let countsss = await countBl.getPostCounts();

		// if (!_.isEmpty(fields)) {
		// 	lists.data = mask(lists.data, fields);
		// }
		res.json(200, countsss);
		return next();
  }

}

module.exports = CountCont;