"use strict";
const SeasonModel = require("./index");

class CoverImageModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "cover_image";
		this.schema = {
			properties: {
				assortment: {
					type: "String"
				},
				image: {
					type: "String"
				}
			}
		};
	}
}

module.exports = CoverImageModel;
