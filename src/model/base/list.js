"use strict";
const BaseModel = require("./index");

class ListModel extends BaseModel {
  constructor() {
    super();
    this.table = "lists";
    this.schema = {
			properties: {
				name: {
					type: "String"
				},
				location: {
					type: "String"
				}
			}
		};
  }
}

module.exports = ListModel;
