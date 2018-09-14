"use strict";
const SeasonModel = require("./index");

class FeatureModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "feature";
		this.schema = {
			properties: {
				feature_name: {
					type: "String"
				},
				feature_desc: {
					type: "String"
				},
				sections: {
					type: "array",
					required: true
				},
				read: {
					type: "String"
				},
				type: {
					type: "String"
				},
				is_draft: {
					type: "Boolean"
				}
			}
		};
	}
}

module.exports = FeatureModel;
