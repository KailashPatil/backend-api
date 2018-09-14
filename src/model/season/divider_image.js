"use strict";
const SeasonModel = require("./index");

class DividerImageModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "divider_image";
		this.schema = {
			properties: {
				assortment: {
					type: "String"
				},
				collection: {
					type: "String"
				},
				image: {
					type: "String"
				}
			}
		};
	}
}

module.exports = DividerImageModel;
