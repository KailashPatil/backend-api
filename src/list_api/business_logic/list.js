"use strict";
const path = require("path");
const srcDir = path.normalize(__dirname + "/../..");

const ListModel = require(srcDir + "/model/base/list");
const Util = require(srcDir + "/util");


const fs = require("fs-extra");
const config = require("config");
const _ = require("underscore");
const mask = require("json-mask");
const shortid = require("shortid");

class ListBL {
	constructor() {
		this.listModel = new ListModel();
	}

	async getLists(	) {
		let dbFilters = {}
		let totalCount = await this.listModel.count(dbFilters);
		let result = {
			total: totalCount,
			data: []
		};
		if (totalCount > 0) {
			let lists = await this.listModel.list(dbFilters);
			result.data = Util.removeEmptyValues(lists.data);
		}
		return result;
	}

	async createLists(params) {
		let dbFilters = {}
		let listExist = {
			name: params.name
		}
		let listCount = await this.listModel.count(listExist);
		// console.log(listCount);
		if(listCount > 0) {
			let e = new Error("List " + params.name + " already exists.");
			e.code = 400;
			throw e;
		}
		let newListData = {
			name: params.name,
			location: params.location
		}
		let lists = await this.listModel.create(newListData);
		return lists;
	}

	async deleteList(listId) {
		let custFilter = {
			_id: listId
		}
		let listCount = await this.listModel.count(custFilter);
		if(listCount < 1) {
			let e = new Error("List id does not exist.");
			e.code = 400;
			throw e;
		}
		let deletedList = await this.listModel.delete(custFilter);
		return deletedList;
	}
	
	async updateList(params) {
		let custFilter = {
			_id: params.id
		}
		let listCount = await this.listModel.count(custFilter);
		console.log(listCount);
		if(listCount < 1) {
			let e = new Error("List id does not exist to Update.");
			e.code = 400;
			throw e;
		}
		let updatedListData = {
			name: params.name,
			location: params.location
		}
		let updatedList = await this.listModel.update(custFilter, updatedListData);
		return updatedList;
	}

}
module.exports = ListBL;