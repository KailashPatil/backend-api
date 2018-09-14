"use strict";
const path = require("path");
const mainSrcDir = path.resolve(__dirname + "/../../..");

const rsa = require(mainSrcDir + "/lib/rsa");
const APICallModel = require("./index");

const config = require("config");

class PreloadedListModel extends APICallModel {
  async getLists() {
    let params = {
      type: "preloaded_list"
    };
    let uriPath = "/static-file";
    let method = "GET";

    let publicKeyPath = path.join(config.get("directory.key"), "public.key");
    let encryptedStr = rsa.encryptStringWithRsaPublicKey(
      "Authorization",
      publicKeyPath
    );
    let headers = {
      Authorization: encryptedStr
    };

    let response = await this.makeAdminAPICall(
      uriPath,
      method,
      params,
      headers
    );
    return response;
  }
}

module.exports = PreloadedListModel;
