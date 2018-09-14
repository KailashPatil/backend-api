"use strict";
const SeasonModel = require("./index");

class ColorModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "color_images";
    this.schema = {
      properties: {
        last_modified: {
          type: "string",
          required: true
        },
        color_id: {
          type: "string",
          required: true
        },
        image_url: {
          type: "string",
          required: true
        },
        processed_images: {
          type: "object",
          required: true
        },
        image_dimensions: {
          type: "object"
        },
        category: {
          type: "string"
        }
      }
    };
  }
}

module.exports = ColorModel;
