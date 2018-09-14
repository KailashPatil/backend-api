"use strict";
const SeasonModel = require("../index");

class ItemModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "item";
    this.schema = {
      properties: {
        name: { type: "string" },
        fit: { type: "string" },
        size: { type: "string" },
        sole: { type: "string" },
        construction: { type: "string" },
        lining: { type: "string" },
        sock: { type: "string" },
        upper_material: { type: "string" },
        technologies: { type: "array" },
        colors: { type: "array" },
        regionName: { type: "string" },
        featured: { type: "string" },
        length: { type: "string" },
        width: { type: "string" },
        height: { type: "string" },
        style_profile: { type: "array" },
        upper: { type: "string" },
        guided_assortment: { type: "array" },
        gender: { type: "array" },
        genders: { type: "array" },
        heel_height: { type: "string" },
        collaborations: { type: "array" },
        additional_feature: { type: "array" },
        must_haves: { type: "array" },
        trading_event: { type: "array" },
        fit_options: { type: "array" },
        tier: { type: "array" },
        new_cont: { type: "array" },
        as_advertised: { type: "array" },
        story: { type: "array" },
        construction_technique: { type: "array" },
        signature_detail: { type: "array" },
        trend: { type: "array" },
        pigskin: { type: "boolean" },
        active_air: { type: "boolean" },
        active_air_vent: { type: "boolean" },
        clarks_plus: { type: "boolean" },
        "gore-tex": { type: "boolean" },
        softwear: { type: "boolean" },
        unstructured: { type: "boolean" },
        vibram: { type: "boolean" },
        wave_walk: { type: "boolean" },
        xl_extralight: { type: "boolean" },
        agion: { type: "boolean" },
        warm_lined: { type: "boolean" }
      },
      allowed_additional_properties: true
    };
  }

  list(filters, fields) {
    if (!filters) {
      filters = {};
    }
    if (!filters["sort"]) {
      filters["sort"] = { order: "ASC" };
    }
    return super.list(filters, fields);
  }

  getByIds(ids) {
    let filter = { _id: { $in: ids } };
    return this.list(filter);
  }

  getByNameAndIds(name, ids) {
    let filter = { name: name, _id: { $in: ids } };
    return this.get(filter);
  }

  getByColorIdAndIds(colorId, ids) {
    let filter = { "colors.id": colorId, _id: { $in: ids } };
    return this.get(filter);
  }

  async updateColorImages(colorIds, colorImages) {
    let updateResult = [];
    for (let colorId of colorIds) {
      let images = colorImages[colorId];
      let tmpResult = await this.updateImagesByColorId(colorId, images);
      updateResult.push(tmpResult);
    }
    return updateResult;
  }

  updateImagesByColorId(colorId, images) {
    let filter = { "colors.id": colorId };
    let params = {
      "colors.$.images": images,
      "colors.$.imageFound": true,
      imageFound: true,
      isEnabled: true
    };
    return this.persistenceService.update(this.table, filter, params);
  }
}

module.exports = ItemModel;
