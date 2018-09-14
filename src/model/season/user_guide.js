"use strict";
const SeasonModel = require("./index");

class UserGuideModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "user_guide";
		this.schema = {
			properties: {
				ug_name: {
					type: "String"
				},
				ug_desc: {
					type: "String"
				},
				type: {
					type: "String"
				},
				is_draft: {
					type: "Boolean"
				},
				ug_video_url: {
					type: "String"
				},
				sections: {
					type: "array"
				}
			}
		};
	}
}

module.exports = UserGuideModel;
