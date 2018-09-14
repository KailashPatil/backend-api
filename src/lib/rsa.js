"use strict";

const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const encryptStringWithRsaPublicKey = function(
  toEncrypt,
  relativeOrAbsolutePathToPublicKey
) {
  let absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
  let publicKey = fs.readFileSync(absolutePath, "utf8");
  let buffer = new Buffer(toEncrypt);
  let encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

const decryptStringWithRsaPrivateKey = function(
  toDecrypt,
  relativeOrAbsolutePathtoPrivateKey
) {
  let absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
  let privateKey = fs.readFileSync(absolutePath, "utf8");
  let buffer = new Buffer(toDecrypt, "base64");
  let decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
};

module.exports = {
  encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
  decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey
};
