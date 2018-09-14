"use strict";

const fs = require("fs-extra");
const config = require("config");
const _ = require("underscore");
const mask = require("json-mask");
const shortid = require("shortid");
const naturalSort = require("javascript-natural-sort");

const MmUtil = {
  get_image_link_video: function(linkedImage, sortedImages) {
    let tmp = _.findWhere(sortedImages, { name: linkedImage });
    if (tmp) {
      return tmp.path;
    }
    return "";
  },
  sort_detail_imgs: function(pathArr, nameArr) {
    let newDetailImagesObj = [];
    let newDetailImg;
    if (pathArr.length < 0) {
      return newDetailImagesObj;
    }
    for (var i = 0; i < pathArr.length; i++) {
      if (nameArr.length > 0) {
        newDetailImg = nameArr[i];
      } else {
        newDetailImg = i + 1;
      }
      newDetailImagesObj.push({
        path: pathArr[i],
        name: newDetailImg
      });
    }

    return MmUtil.naturalSortArr(newDetailImagesObj);
  },
  naturalSortArr: function(arr) {
    return arr.sort(function(a, b) {
      return naturalSort(a.name, b.name);
    });
  },
  formatSectionData: function(uploadedSections, sections) {
    if (_.isEmpty(uploadedSections)) {
      return sections;
    } else {
      let tmpSection = [];
      for (let section of sections) {
        let tmp = _.findWhere(uploadedSections, {
          original_name: section.image
        });
        if (tmp) {
          section["image"] = tmp.file_name;
        }
      }
      return sections;
    }
  },
  getDuplicateArr: function(arr) {
    var sorted_arr = arr.sort();
    var results = [];
    for (var i = 0; i < arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }
};
module.exports = MmUtil;
