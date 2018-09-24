"use strict";
const BaseModel = require("./index");

class PlayerModel extends BaseModel {
  constructor() {
    super();
    this.table = "player";
    this.schema = {
			properties: {
				player: {
					type: "String"
				},
				runs: {
					type: "number"
				},
				country: {
					type: "String"
				},
				profile: {
					type: "String"
				}
			}
		};
  }
}

module.exports = PlayerModel;
