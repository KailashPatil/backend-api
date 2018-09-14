"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/..");

const APIAuthBL = require(srcDir + "/user_api/business_logic/auth/api");

const SlackNotify = require(srcDir + "/util/slack");

const AuthUtil = {
  isAPIAuthorised: () => {
    return async (req, res, next) => {
      let noAPIAuthReqPaths = ["/", "/favicon.ico"];
      let path = req.path();
      if (noAPIAuthReqPaths.indexOf(path) > -1) {
        return next();
      }
      try {
        let authParams = {
          apiKey: req.headers["x-api-key"],
          secretToken: req.headers["x-secret-token"]
        };
        let apiAuthBL = new APIAuthBL();
        req.app_detail = await apiAuthBL.isAuthorised(authParams);
        apiAuthBL = null;
        return next();
      } catch (e) {
        Log.error("API auth failed", e);
        return next(e);
      }
    };
  }
};

module.exports = AuthUtil;
