"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/../../../..");

const rsa = require(srcDir + "/lib/rsa");
const ProdUtil = require(srcDir + "/util/product");

const config = require("config");
const request = require("request");
const fs = require("fs-extra");
const qs = require("querystring");
const _ = require("underscore");

class PublishedProduct {
  constructor(season) {
    this.season = season;

    this.productFile = path.join(
      config.get("directory.season_data"),
      this.season,
      "published/current.json"
    );
  }

  createInitCurrentJsonData() {
    if (!fs.existsSync(this.productFile)) {
      fs.outputJsonSync(this.productFile, {
        version: 0,
        publish_started_at: _.now(),
        publish_finished_at: _.now(),
        result: {
          regions: [],
          download_manager_links: []
        }
      });
    }
  }

  getCurrentJSONData() {
    let data = fs.readJsonSync(this.productFile);
    return data;
  }

  getProductVersion() {
    let data = this.getCurrentJSONData();
    let version = data.version;
    data = null;
    return version;
  }

  getAllProducts() {
    let data = this.getCurrentJSONData();
    let allProducts = data.result.regions;
    data = null;
    return allProducts;
  }

  getProductsByFilter(region, asrt, coll, item, colorId) {
    let products = this.getAllProducts();

    let filters = {
      region: region,
      assortment: asrt,
      collection: coll,
      item: item,
      color_id: colorId
    };
    return ProdUtil.getDataWithFilter(products, filters);
  }
}

module.exports = PublishedProduct;
