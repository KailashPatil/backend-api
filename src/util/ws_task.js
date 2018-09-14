"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/..");

const AWSSQS = require(srcDir + "/util/aws_sqs");
const WSLogModel = require(srcDir + "/model/season/ws_log");

const config = require("config");
const _ = require("underscore");

class WSTask {
  constructor() {
    this.sqs = new AWSSQS();
  }

  async triggerSyncImages(season) {
    let params = { season: season };
    let task = "image_import";
    await this.triggerWSTask("image_import", params);
  }

  async triggerProcessImages(params) {
    let task = "process_aws_image";
    await this.triggerWSTask(task, params);
  }

  async triggerExportList(params) {
    let task = "export_list";
    await this.triggerWSTask(task, params);
  }

  async triggerWSTask(task, params) {
    let message = JSON.stringify(params);

    let sqsConfig = config.get("aws.queue_urls")[task];

    await this.sqs.sendMessage(
      sqsConfig["url"],
      message,
      sqsConfig["msg_group_id"]
    );
    await this.createTriggerLog(params, task);
  }

  createTriggerLog(inParams, task) {
    let status = "triggered";
    let filters = {
      status: status,
      task: task,
      in_params: inParams
    };
    let params = {
      status: status,
      task: task,
      in_params: inParams
    };
    params["created_date"] = new Date();
    let wsLogModel = new WSLogModel(inParams["season"]);
    return wsLogModel.upsert(filters, params);
  }
}

module.exports = WSTask;
