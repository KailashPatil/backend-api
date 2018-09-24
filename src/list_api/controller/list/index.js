"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/../../..");
const listAPIDir = path.resolve(__dirname + "/../..");
const ListBL = require(listAPIDir + "/business_logic/list");
// const Validator = require("./validator");
const Controller = require(srcDir + "/util/controller");

const _ = require("underscore");
const mask = require("json-mask");
const config = require("config");

class ListCont extends Controller {
	constructor(server) {
    super(server);
  }

  setupRoutes() {
    this.setupRoute("get", "/list", this.getLists);
    this.setupRoute("post", "/list", this.createList);
    this.setupRoute("del", "/list/:id", this.deleteList);
    this.setupRoute("put", "/list/:id", this.updateList);
  }

  async getLists(req, res, next) {
		let listBl = new ListBL();
		let lists = await listBl.getLists();

		// if (!_.isEmpty(fields)) {
		// 	lists.data = mask(lists.data, fields);
		// }
		res.json(200, lists);
		return next();
  }

  async createList(req, res, next) {
  	// console.log(req, 'ppppp');
  	let params = req.all_params;

		let listBl = new ListBL();
		let lists = await listBl.createLists(params);
		let allLists = await listBl.getLists();

		// if (!_.isEmpty(fields)) {
		// 	lists.data = mask(lists.data, fields);
		// }
		res.json(200, allLists);
		return next();
  }

  async deleteList(req, res, next) {
  	// console.log(req, 'ppppp');
  	let params = req.all_params;

		let listBl = new ListBL();
		let lists = await listBl.deleteList(params.id);
		let allLists = await listBl.getLists();

		// if (!_.isEmpty(fields)) {
		// 	lists.data = mask(lists.data, fields);
		// }
		res.json(200, allLists);
		return next();
  }

  async updateList(req, res, next) {
  	console.log(req, 'ppppp');
  	let params = req.all_params;

		let listBl = new ListBL();
		let lists = await listBl.updateList(params);
		let allLists = await listBl.getLists();

		// if (!_.isEmpty(fields)) {
		// 	lists.data = mask(lists.data, fields);
		// }
		res.json(200, allLists);
		return next();
  }

}

module.exports = ListCont;