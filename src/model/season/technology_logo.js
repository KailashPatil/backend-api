"use strict";
const SeasonModel = require("./index");

class TechnologyLogoModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "technology";
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
				catergory: {
					type: "String"
				},
				region: {
					type: "String"
				},
				story_id: {
					type: "String"
				},
				sub_story_id: {
					type: "String"
				}
			}
		};
	}
}

module.exports = TechnologyLogoModel;
