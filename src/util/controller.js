"use strict";
// const AuthUtil = require("./auth");

const _ = require("underscore");

class Controller {
  constructor(server) {
    this.server = server;
  }

  setupRoutes() {
    throw new Error("Routes are not setup for a controller");
  }

  setupRoute(method, path, ...middlewares) {
    //For error handling and binding this to the middlewares
    let modFns = [];
    for (let idx in middlewares) {
      let bindedFn = middlewares[idx].bind(this);
      if (middlewares[idx].constructor.name === "AsyncFunction") {
        modFns[idx] = async function(req, res, next) {
          try {
            await bindedFn(req, res, next);
          } catch (e) {
            if (!e.code) {
              e.code = 500;
            }
            return next(e);
          }
        };
      } else {
        modFns[idx] = bindedFn;
      }
    }

    let params = [path].concat(modFns);
    this.server[method].apply(this.server, params);
  }

  // isAuthorised(permissions) {
  //   return AuthUtil.isUserAuthorised(permissions);
  // }

  validateAllParams(validateFn) {
    return async (req, res, next) => {
      let result = await validateFn(req.all_params, req);
      if (!result.is_valid) {
        let e = new Error("Validation failed");
        e.errors = result.errors;
        e.code = 400;
        return next(e);
      }
      return next();
    };
  }
}

module.exports = Controller;
