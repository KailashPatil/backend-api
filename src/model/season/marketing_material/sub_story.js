"use strict";

const SeasonModel = require("../index");

class MMSubStoryModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "mm_sub_story";
		this.schema = {
			properties: {
				category_name: {
					type: "String",
					required: true
				},
				sub_story_name: {
					type: "String",
					required: true
				},
				header_image: {
					type: "String",
					required: true
				},
				video_url: {
					type: "String"
				},
				story_id: {
					type: "String",
					required: true
				},
				detail_images_name: {
					type: "Array"
				},
				detail_images: {
					type: "Array"
				}
			}
		};
	}
}

module.exports = MMSubStoryModel;
