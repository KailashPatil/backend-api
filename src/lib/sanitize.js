"use strict";
const _ = require("underscore");

const TEST_REGEX = /^\$/;
const REPLACE_REGEX = /^\$/g;
const mongoSanitize = (target, options) => {
  var replaceWith = "";
  if (TEST_REGEX.test(target)) {
    target = target.replace(REPLACE_REGEX, replaceWith);
  }

  if (typeof target == "string") {
    target = target.trim();
    // target = escape(target);
  }
  return target;
};

const sanitizeNestedJsonObj = (jsonObj, options) => {
  let sanitizedJsonObj;
  if (jsonObj instanceof Array) {
    sanitizedJsonObj = [];
    for (let idx in jsonObj) {
      sanitizedJsonObj[idx] = sanitizeNestedJsonObj(jsonObj[idx], options);
    }
  } else if (typeof jsonObj == "object") {
    sanitizedJsonObj = {};
    for (let key in jsonObj) {
      let sanitizedKey = mongoSanitize(key);
      sanitizedJsonObj[sanitizedKey] = sanitizeNestedJsonObj(
        jsonObj[key],
        options
      );
    }
  } else {
    sanitizedJsonObj = mongoSanitize(jsonObj, options);
  }
  return sanitizedJsonObj;
};

const sanitizeMiddleware = options => {
  return (req, res, next) => {
    ["body", "params", "query"].forEach(k => {
      if (req[k]) {
        req[k] = sanitizeNestedJsonObj(req[k], options);
      }
    });
    req.all_params = _.extend(req.query, req.body, req.params);
    next();
  };
};

module.exports = {
  sanitizeMiddleware: sanitizeMiddleware,
  sanitizeJson: sanitizeNestedJsonObj,
  mongoSanitize: mongoSanitize
};
