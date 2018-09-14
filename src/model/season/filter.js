"use strict";
const SeasonModel = require("./index");

class FilterModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "filter";
		this.schema = {
			properties: {
				db_key: {
					type: "String"
				},
				regions: {
					type: "Array"
				},
				type: {
					type: "String"
				},
				display_name: {
					type: "String"
				},
				filter_name: {
					type: "String"
				},
				checked: {
					type: "Boolean"
				}
			}
		};
	}
}

module.exports = FilterModel;
