"use strict";

const _ = require("underscore");

const ProductUtil = {
  getDataWithFilter: (products, filters) => {
    let region = filters["region"];
    let asrt = filters["assortment"];
    let coll = filters["collection"];
    let item = filters["item"];
    let colorId = filters["color_id"];

    if (_.isEmpty(region)) {
      return products;
    }
    let regionData = _.findWhere(products, { name: region });
    if (!regionData) {
      return null;
    }

    if (_.isEmpty(asrt)) {
      return regionData;
    }
    let asrtData = _.findWhere(regionData.assortments, { name: asrt });
    if (!asrtData) {
      return null;
    }

    if (_.isEmpty(coll)) {
      return asrtData;
    }
    let collData = _.findWhere(asrtData.collections, { name: coll });
    if (!collData) {
      return null;
    }

    if (_.isEmpty(item)) {
      return collData;
    }
    let itemData = _.findWhere(collData.items, { name: item });
    if (!itemData) {
      return null;
    }

    if (_.isEmpty(colorId)) {
      return itemData;
    }
    let colorData = _.findWhere(itemData.colors, { id: colorId });
    if (!colorData) {
      return null;
    }
    return colorData;
  }
};

module.exports = ProductUtil;
