"use strict";
const SeasonModel = require("./index");

class VisualSegmentationModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "visual_segmentation";
		this.schema = {
			properties: {
				month: {
					type: "String"
				},
				distribution: {
					type: "String"
				},
				gender: {
					type: "String"
				},
				brand: {
					type: "String"
				},
				detail_images: {
					type: "Array"
				},
				detail_images_name: {
					type: "Array"
				},
				regions: {
					type: "Array"
				}
			}
		};
	}
}
module.exports = VisualSegmentationModel;
