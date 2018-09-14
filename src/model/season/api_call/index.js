"use strict";
const path = require("path");
const mainSrcDir = path.resolve(__dirname + "/../../..");
const rsa = require(mainSrcDir + "/lib/rsa");

const config = require("config");
const request = require("request");
const qs = require("querystring");
const _ = require("underscore");

class APICallModel {
  constructor(season) {
    this.season = season;

    this.adminAppURL = config.get("season." + this.season + ".admin_app_url");
    this.serviceAppURL = config.get(
      "season." + this.season + ".service_app_url"
    );
    this.buyersAppURL = config.get("select_app.api_url");
  }

  makeAPICall(baseURL, urlPath, method, params, headers) {
    return new Promise((resolve, reject) => {
      let options = {
        baseUrl: baseURL,
        method: method,
        headers: headers,
        json: true
      };

      if (!_.isEmpty(params)) {
        if (method == "POST") {
          // options["formData"] = JSON.stringify(params);
          options["form"] = params;
        } else {
          urlPath += "?" + qs.stringify(params);
        }
      }
      options["uri"] = urlPath;
      request(options, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        if (res.statusCode != 200) {
          let e = new Error(res.statusCode + " is not a valid response code");
          e.errors = body;
          return reject(e);
        }
        return resolve(body);
      });
    });
  }

  async makeServiceAPICall(urlPath, method, params, headers) {
    let response = await this.makeAPICall(
      this.serviceAppURL,
      urlPath,
      method,
      params,
      headers
    );
    return response;
  }

  async makeAdminAPICall(urlPath, method, params, headers) {
    let response = await this.makeAPICall(
      this.adminAppURL,
      urlPath,
      method,
      params,
      headers
    );
    return response;
  }

  async makeBuyersAPICall(urlPath, method, params) {
    let publicKeyPath = path.join(config.get("directory.key"), "public.key");

    let encryptedStr = rsa.encryptStringWithRsaPublicKey(
      "Authorization",
      publicKeyPath
    );
    let headers = {
      Authorization: encryptedStr
    };

    let response = await this.makeAPICall(
      this.buyersAppURL,
      urlPath,
      method,
      params,
      headers
    );
    return response;
  }
}

module.exports = APICallModel;
