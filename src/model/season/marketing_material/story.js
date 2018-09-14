"use strict";

const SeasonModel = require("../index");

class MMStoryModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "marketing_material";
		this.schema = {
			properties: {
				category_name: {
					type: "String",
					required: true
				},
				display_name: {
					type: "String",
					required: true
				},
				header_image: {
					type: "String",
					required: true
				},
				type: {
					type: "String",
					required: true
				},
				story_name: {
					type: "String",
					required: true
				},
				regions: {
					type: "Array",
					required: true
				},
				detail_images_name: {
					type: "Array"
				},
				detail_images: {
					type: "Array"
				},
				story_video_url: {
					type: "String"
				}
			}
		};
	}
}

module.exports = MMStoryModel;
