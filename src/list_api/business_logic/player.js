"use strict";
const path = require("path");
const srcDir = path.normalize(__dirname + "/../..");

const PlayerModel = require(srcDir + "/model/base/player");
const Util = require(srcDir + "/util");


const fs = require("fs-extra");
const config = require("config");
const _ = require("underscore");
const mask = require("json-mask");
const shortid = require("shortid");

class PlayerBL {
	constructor() {
		this.playerModel = new PlayerModel();
	}

	async getPlayers(dbFilters) {

		// dbFilters["runs"] = {$gt: 1000, $lt: 12000};
		dbFilters["sort"] = {player:"DESC"};

		//gets runs greater than 100000
		// players.data.find( { runs: { $gt: 10000 } } )
		
		let totalCount = await this.playerModel.count(dbFilters);
		let result = {
			total: totalCount,
			data: []
		};
		if (totalCount > 0) {
			let lists = await this.playerModel.list(dbFilters);
			result.data = Util.removeEmptyValues(lists.data);
		}
		return result;
	}

	async createPlayer(params) {

		let custFilters = {
			player:params.player
		}
		let playerCount = await this.playerModel.count(custFilters);
		if(playerCount > 0) {
			let e = new Error("Player " + params.player + " already exists.");
			e.code = 400;
			throw e;
		}

		let newPlayerData = {
			player: Util.toCapitalCase(params.player), 
			runs: parseInt(params.runs),
			profile: params.profile,
			country: params.country
		}
		let players = await this.playerModel.create(newPlayerData);
		return players;

	}

	async deletePlayer(playerId) {
		let custFilters = {
			_id : playerId
		}
		let playerCount = await this.playerModel.count(custFilters);
		if(playerCount < 1) {
			let e = new Error("This id does not exist.");
			e.code = 400;
			throw e;
		}
		let delPlayer = await this.playerModel.delete(custFilters);

		return delPlayer;
	}

	async updatePlayer(params) {
		let custFilters = {
			_id : params.id
		}
		let playerCount = await this.playerModel.count(custFilters);
		console.log(playerCount, '1212');
		if(playerCount < 1) {
			let e = new Error("This id does not exist to Update.");
			e.code = 400;
			throw e;
		}
		let updatedPlayerData = {
			player : params.player,
			country : params.country,
			profile : params.profile,
			runs : parseFloat(params.runs)
		}
		console.log(updatedPlayerData, custFilters);
		let updatedPlayer = await this.playerModel.update(custFilters, updatedPlayerData);
		console.log(updatedPlayer, 'updatedPlayer');

		return updatedPlayer;
	}

}
module.exports = PlayerBL;