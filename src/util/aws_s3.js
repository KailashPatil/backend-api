"use strict";
const AWS = require("aws-sdk");

const config = require("config");
const fs = require("fs");
const _ = require("underscore");
const path = require("path");

class AWSS3 {
  constructor(season) {
    this.season = season;
    this.bucketName = config.get("season." + season + ".aws.bucket_name");

    AWS.config = {
      accessKeyId: config.get("aws.access_key_id"),
      secretAccessKey: config.get("aws.secret_access_key")
    };

    this.s3 = new AWS.S3({ signatureVersion: "v2" });
    this.environment = config.util.getEnv("NODE_ENV");
  }

  getBaseURL() {
    if (config.has("season." + this.season + ".aws.cdn_url")) {
      return config.get("season." + this.season + ".aws.cdn_url");
    } else {
      return config.get("aws.base_url") + "/" + this.bucketName;
    }
  }

  upload(src, dest, options) {
    return new Promise((resolve, reject) => {
      let extName = path.extname(dest);
      if (!extName) {
        dest += "/" + path.basename(src);
      }
      let dstLink = this.getBaseURL() + "/" + dest;
      // Log.info(
      //   "AWS Upload Info",
      //   AWS.config,
      //   {
      //     Bucket: this.bucketName,
      //     Key: dest,
      //     ACL: "public-read"
      //   },
      //   options
      // );

      if (this.environment == "development") {
        Log.info("DEV ENV Physically not uploaded");
        return resolve(dstLink);
      }

      let fileStream = fs.createReadStream(src);
      fileStream.once("error", err => {
        return reject(err);
      });
      fileStream.on("open", () => {
        let object = {
          Bucket: this.bucketName,
          Key: dest,
          Body: fileStream,
          ACL: "public-read"
        };

        if (options) {
          object = _.extend(object, options);
        }

        this.s3.putObject(object, err => {
          if (err) {
            return reject(err);
          }
          return resolve(dstLink);
        });
      });
    });
  }

  isExists(key) {
    return new Promise((resolve, reject) => {
      if (this.environment == "development") {
        let randomResult = false; //Math.random() >= 0.5;
        // Log.info("DEV ENV Physically not checked:", randomResult);
        return resolve(randomResult);
      }
      let params = {
        Bucket: this.bucketName,
        Key: key
      };
      this.s3.headObject(params, function(err, metadata) {
        if (err) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      });
    });
  }

  deleteKeys(keys) {
    return new Promise((resolve, reject) => {
      if (!_.isArray(keys)) {
        keys = [keys];
      }

      //only 1000 object can be deleted at a time
      const maxLength = 1000;

      let toBeDeletedKeys = keys.splice(0, maxLength);
      if (toBeDeletedKeys.length == 0) {
        return resolve();
      }

      let deleteObjects = [];
      for (let key of toBeDeletedKeys) {
        deleteObjects.push({
          Key: key
        });
      }

      let params = {
        Bucket: this.bucketName,
        Delete: {
          Objects: deleteObjects
        }
      };

      this.s3.deleteObjects(params, (e, data) => {
        if (e) {
          return reject(e);
        } else {
          if (keys.length > 0) {
            return resolve(this.deleteKeys(keys));
          } else {
            return resolve();
          }
        }
      });
    });
  }

  deleteFolder(folderKey) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.bucketName,
        Prefix: folderKey + "/"
      };

      if (this.environment == "development") {
        let randomResult = 0;
        if (Math.random() >= 0.5) {
          randomResult = Math.ceil(Math.random() * 10);
        }
        Log.info("DEV ENV Physically not deleted:", randomResult);
        return resolve(randomResult);
      }

      this.s3.listObjects(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        let deletedKeys = _.pluck(data.Contents, "Key");

        let totalObjects = deletedKeys.length;
        if (totalObjects == 0) {
          return resolve(totalObjects);
        }

        return this.deleteKeys(deletedKeys)
          .then(() => {
            Log.info("Deleted AWS folder with Key", folderKey, totalObjects);
            return resolve(totalObjects);
          })
          .catch(e => {
            return reject(e);
          });
      });
    });
  }
}

module.exports = AWSS3;
