"use strict";
const SeasonModel = require("./index");

class SalesNotesModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "sales_notes";
		this.schema = {
			properties: {
				assortment: {
					type: "String"
				},
				collection: {
					type: "String"
				},
				color_id: {
					type: "String"
				},
				region: {
					type: "String"
				},
				user_id: {
					type: "String"
				},
				note: {
					type: "String"
				}
			}
		};
	}
}
module.exports = SalesNotesModel;
