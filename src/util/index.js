"use strict";

const { URL, URLSearchParams } = require("url");
const _ = require("underscore");

const Util = {
  removeEmptyValues: array => {
    if (array && array instanceof Array && array.length > 0) {
      return array.filter(tmp => {
        return tmp;
      });
    } else {
      return [];
    }
  },
  removeEmptyKeys: object => {
    for (let i in object) {
      if (!object[i]) {
        delete object[i];
      }
    }
    return object;
  },
  sleep: ms => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  },
  trim: str => {
    if (str) {
      if (typeof str == "string") {
        return str.trim();
      } else {
        return str;
      }
    } else {
      return "";
    }
  },
  toCapitalCase: str => {
    str = str.trim().toLowerCase();
    let splitBySpaces = str.split(/\s+/);
    let capitalCases = [];
    for (let s of splitBySpaces) {
      capitalCases.push(s.charAt(0).toUpperCase() + s.slice(1));
    }
    return capitalCases.join(" ");
  },
  convertStrToArray: str => {
    let returnArr = [];

    if (str instanceof Array) {
      return str;
    } else if (typeof str != "string") {
      return returnArr;
    }

    str = Util.trim(str);
    if (_.isEmpty(str)) {
      return returnArr;
    }

    let arr = str.split(",");
    for (let a of arr) {
      a = Util.trim(a);
      if (_.isEmpty(a)) {
        continue;
      }
      returnArr.push(a);
    }
    return returnArr;
  },
  convertToBoolean(val) {
    if (typeof val == "boolean") {
      return val;
    } else if (typeof val == "string") {
      val = val.toLowerCase();
      return val == "true";
    } else {
      return !_.isEmpty(val);
    }
  },
  getDisplaySeason: season => {
    let dispSeason = season.split("-");
    if (dispSeason && dispSeason[0]) {
      dispSeason = dispSeason[0].toUpperCase();
      if (dispSeason.startsWith("DEV")) {
        //To reduce DEVELOPMENT to DEV
        return "DEV";
      } else {
        return dispSeason;
      }
    } else {
      return "";
    }
  },
  appendQueryToURL(url, queryParams) {
    url = new URL(url);
    for (let key in queryParams) {
      url.searchParams.append(key, queryParams[key]);
    }
    return url.href;
  },
  mapObjectIdsToString(arr) {
    return _.map(arr, function(tmp) {
      return tmp.toString();
    });
  },
  toDBSlug(str) {
    if (!str) {
      return "";
    }
    return str
      .toLowerCase()
      .trim()
      .replace(/&#10;/g, " ")
      .replace(/\.+/g, "")
      .replace(/\s+|\/+/g, "_");
  },
  mapData: (data, map) => {
    if (_.isEmpty(data)) {
      data = {};
    }
    let retVal = {};
    _.each(map, function(value, key, list) {
      retVal[key] = data[value];
    });
    return retVal;
  },
  isRightSize: (width, height) => {
    let is_right_size = false;
    if (!_.isEmpty(width) || !_.isEmpty(height)) {
      if (width.trim() == "3000" && height.trim() == "3000") {
        is_right_size = true;
      }
    }
    return is_right_size;
  },
  replaceSpace: str => {
    str = str.trim().toLowerCase();
    return str.replace(/\s+/g, "_");
  }
};

module.exports = Util;
