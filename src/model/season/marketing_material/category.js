"use strict";

const SeasonModel = require("../index");

class MMCategoryModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "mm_category";
		this.schema = {
			properties: {
				name: {
					type: "String",
					required: true
				}
			}
		};
	}
}

module.exports = MMCategoryModel;
