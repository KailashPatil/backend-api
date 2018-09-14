"use strict";
const SeasonModel = require("./index");

class AdditionalFeatureLogoModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "additional_feature";
		this.schema = {
			properties: {
				name: {
					type: "String"
				},
				slug: {
					type: "String"
				},
				image: {
					type: "String"
				},
				story_id: {
					type: "String"
				}
			}
		};
	}
}

module.exports = AdditionalFeatureLogoModel;
