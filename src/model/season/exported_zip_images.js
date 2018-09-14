"use strict";
const SeasonModel = require("./index");

class ExportedZipImagesModel extends SeasonModel {
  constructor(season) {
    super(season);
    this.table = "exported_zip_images";
    this.schema = {
      properties: {
        timestamped_color_ids: {
          type: "array",
          required: true
        },
        thumb_images: {
          type: "string",
          required: true
        },
        large_images: {
          type: "string",
          required: true
        },
        unique_id: {
          type: "string"
        }
      }
    };
  }

  getByTimestampedColorIds(timestampedColorIds) {
    let filters = {
      $and: [
        { timestamped_color_ids: { $size: timestampedColorIds.length } },
        { timestamped_color_ids: { $all: timestampedColorIds } }
      ]
    };
    return this.get(filters);
  }
}

module.exports = ExportedZipImagesModel;
