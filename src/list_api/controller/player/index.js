"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/../../..");
const listAPIDir = path.resolve(__dirname + "/../..");

const PlayerBL = require(listAPIDir + "/business_logic/player");
// const Validator = require("./validator");
const Controller = require(srcDir + "/util/controller");

const _ = require("underscore");
const mask = require("json-mask");
const config = require("config");

class PlayerCont extends Controller {
	constructor(server) {
    super(server);
  }

  setupRoutes() {
    this.setupRoute("get", "/player", this.getPlayers);
    this.setupRoute("post", "/player", this.createPlayer);
    this.setupRoute("del", "/player/:id", this.deletePlayer);
    this.setupRoute("put", "/player/:id", this.updatePlayer);
  }

  async getPlayers(req, res, next) {
  	// let fields = "country,player,runs,_id";
  	let playerFilters = req.all_params;

		let playerBl = new PlayerBL();
		let players = await playerBl.getPlayers(playerFilters);

		// if(!_.isEmpty(fields)){
		// 	players.data = mask(players.data, fields);  // mask - get particular fields value
		// }
    // console.log(players, "players one");
		res.json(200, players);
		return next();
  }

  async createPlayer(req, res, next) {
    let params = req.all_params;

		let playerBl = new PlayerBL();
		let players = await playerBl.createPlayer(params);
    let allPlayers = await playerBl.getPlayers({});

		res.json(200, allPlayers);
		return next();
  }

  async deletePlayer(req, res, next) {
    let params = req.all_params;
    console.log(params, 'delete req');

    let playerBl = new PlayerBL();
    let players = await playerBl.deletePlayer(params.id);
    let allPlayers = await playerBl.getPlayers({});

    res.json(200, allPlayers);
    return next();
  }
  
  async updatePlayer(req, res, next) {
    let params = req.all_params;
    console.log(params, 'delete req');

    let playerBl = new PlayerBL();
    let players = await playerBl.updatePlayer(params);
    let allPlayers = await playerBl.getPlayers({});

    res.json(200, allPlayers);
    return next();
  }

}

module.exports = PlayerCont;