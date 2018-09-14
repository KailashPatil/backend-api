"use strict";

const AuditLogUtil = require("./audit_log");

const ErrorUtil = {
  unknownMethodHandler: function(req, res, e, next) {
    if (req.method.toLowerCase() === "options") {
      var allowHeaders = [
        "Accept",
        "Accept-Version",
        "Content-Type",
        "Api-Version",
        "Origin",
        "X-Requested-With",
        "Authorization",
        "magic_link"
      ]; // added Origin & X-Requested-With & **Authorization**

      if (res.methods.indexOf("OPTIONS") === -1) {
        res.methods.push("OPTIONS");
      }

      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Headers", allowHeaders.join(", "));
      res.header("Access-Control-Allow-Methods", res.methods.join(", "));
      res.header("Access-Control-Allow-Origin", req.headers.origin);

      return res.send(200);
    } else if (req.method.toLowerCase() === "head") {
      //For the newrelic monitoring
      return res.send(200);
    } else {
      Log.error("Method Not Allowed", req.getPath(), req.method);
      return res.send(405, { message: "Method Not Allowed." });
    }
  },
  uncaughtException: function(req, res, route, e) {
    let code = 500;
    if (e.code && !isNaN(e.code)) {
      code = e.code;
    }
    let errResponse = e;
    if (e.message) {
      errResponse = { errors: [e.message] };
    }
    if (e.errors) {
      errResponse = {
        message: e.message,
        errors: e.errors
      };
    }

    if (!res._headerSent) {
      res.send(code, errResponse);
    }
    AuditLogUtil.log(req, res, e);
  },
  handleException: function(req, res, e, next) {
    ErrorUtil.uncaughtException(req, res, null, e);
  },
  notFound: function(req, res, e, next) {
    let code = 404;
    let errResponse = e;
    if (e.message) {
      errResponse = { message: e.message };
    }
    if (!res._headerSent) {
      res.send(code, errResponse);
    }
    AuditLogUtil.log(req, res, e);
  }
};

module.exports = ErrorUtil;
