"use strict";
const path = require("path");
const srcDir = path.normalize(__dirname + "/../..");

const CountModel = require(srcDir + "/model/base/count");
const Util = require(srcDir + "/util");


const fs = require("fs-extra");
const config = require("config");
const _ = require("underscore");
const mask = require("json-mask");
const shortid = require("shortid");

class CountBL {
	constructor() {
		this.countModel = new CountModel();
	}

	async getCounts(filters, region) {
		let dbFilters = {}
		let totalCount = await this.countModel.count(dbFilters);
		console.log(totalCount);
		let result = {
			total: totalCount,
			data: []
		};
		if (totalCount > 0) {
			let counts = await this.countModel.list(dbFilters);
			result.data = Util.removeEmptyValues(counts.data);
		}
		return result;
	}

	async getPostCounts(filters, region) {
		let dbFilters = {}
		let totalCount = await this.countModel.count(dbFilters);
		console.log(totalCount);
		let result = {
			total: totalCount,
			data: []
		};
		if (totalCount > 0) {
			let counts = await this.countModel.list(dbFilters);
			result.data = Util.removeEmptyValues(counts.data);
		}
		return result;
	}

}
module.exports = CountBL;