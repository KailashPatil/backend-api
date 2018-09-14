"use strict";
const path = require("path");
const config = require("config");
const fs = require("fs-extra");
const _ = require("underscore");

class ManageDataVersion {
  constructor(season) {
    this.season = season;

    this.dataFilesDir = path.join(
      config.get("directory.season_data"),
      this.season,
      "published"
    );
  }

  publishNewDataVersion(tmpFilePath) {
    let newData = fs.readJSONSync(tmpFilePath);
    let newVersion = newData.version;

    let newFilename = this.dataFilesDir + "/" + newVersion + ".json";
    fs.outputJSONSync(newFilename, newData, { spaces: 2 });

    let currentFilename = this.dataFilesDir + "/current.json";
    fs.outputJSONSync(currentFilename, newData, { spaces: 2 });

    return newVersion;
  }

  publishOldDataVersion(version) {
    let oldVersionInfo = null;
    try {
      oldVersionInfo = this.getVersionInfo(version);
    } catch (e) {
      e = new Error("Data version " + version + " doesn't exist");
      e.code = 400;
      throw e;
    }
    let oldVersion = oldVersionInfo["version"];
    if (oldVersionInfo["republished_from"]) {
      oldVersion = oldVersionInfo["republished_from"];
    }
    let oldVersionPath = this.dataFilesDir + "/" + version + ".json";

    let currentVersionInfo = this.getVersionInfo("current");
    let currentVersion = currentVersionInfo["version"];
    let currentVersionPath = this.dataFilesDir + "/current.json";

    let newVersion = parseInt(currentVersion) + 1;
    let newVersionFileName = newVersion + "-" + oldVersion;
    let newVersionFilePath =
      this.dataFilesDir + "/" + newVersionFileName + ".json";

    let data = fs.readJSONSync(oldVersionPath);
    data["version"] = newVersion;
    data["republished_from"] = oldVersion;
    data["publish_started_at"] = _.now();
    data["publish_finished_at"] = _.now();

    fs.outputJSONSync(currentVersionPath, data, { spaces: 2 });
    fs.outputJSONSync(newVersionFilePath, data, { spaces: 2 });

    data = null;

    return newVersion;
  }

  getDataVersions(options = {}) {
    let files = fs.readdirSync(this.dataFilesDir);
    let appVersions = [];
    for (let file of files) {
      if (
        file.indexOf("_") > -1 ||
        file.indexOf(".json") == -1 ||
        file == "current.json"
      ) {
        //Backed up versions on Publish fail from WS
        continue;
      }

      let version = file.replace(".json", "");

      let message = version;
      if (version.match("-")) {
        let splitVersions = version.split("-");
        message =
          splitVersions[0] + " (republished from " + splitVersions[1] + ")";
      }

      appVersions.push({
        index: parseInt(version),
        path: version,
        message: message
      });
    }

    appVersions.sort((a, b) => {
      //Sorting in descending order
      return b.index - a.index;
    });

    let total = appVersions.length;
    let limit = 10;
    if (options["limit"]) {
      limit = options["limit"];
    }
    let offset = 0;
    if (options["offset"]) {
      offset = options["offset"];
    }
    appVersions = appVersions.slice(offset, limit);

    return { total: total, limit: limit, offset: offset, data: appVersions };
  }

  getVersionInfo(version) {
    let versionDataFilePath = this.dataFilesDir + "/" + version + ".json";
    let data = fs.readJsonSync(versionDataFilePath);
    let versionInfo = {
      version: data.version,
      publish_started_at: data.publish_started_at
    };
    if (data["publish_finished_at"]) {
      versionInfo["publish_finished_at"] = data["publish_finished_at"];
    }
    if (data["republished_from"]) {
      versionInfo["republished_from"] = data["republished_from"];
    }
    data = null;
    return versionInfo;
  }
}

module.exports = ManageDataVersion;
