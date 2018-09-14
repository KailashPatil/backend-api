"use strict";
const SeasonModel = require("./index");

class PreLoadedListModel extends SeasonModel {
	constructor(season) {
		super(season);
		this.table = "pre_loaded_list";
		this.schema = {
			properties: {
				list_name: {
					type: "String"
				},
				regions: {
					type: "Array"
				},
				list_data: {
					type: "Array"
				},
				list_file_name: {
					type: "String"
				}
			}
		};
	}
}
module.exports = PreLoadedListModel;
