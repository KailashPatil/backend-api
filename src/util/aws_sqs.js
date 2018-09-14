"use strict";
const AWS = require("aws-sdk");

const config = require("config");

class AWSSQS {
  constructor() {
    AWS.config = {
      accessKeyId: config.get("aws.access_key_id"),
      secretAccessKey: config.get("aws.secret_access_key"),
      region: config.get("aws.region")
    };
    this.sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  }

  listQueues() {
    return new Promise((resolve, reject) => {
      let params = {};
      this.sqs.listQueues(params, function(err, data) {
        if (err) {
          return reject(err);
        } else {
          let queueURLS = data["QueueUrls"] ? data["QueueUrls"] : [];
          return resolve(queueURLS);
        }
      });
    });
  }

  sendMessage(queueURL, message, msgType) {
    return new Promise((resolve, reject) => {
      let params = {
        QueueUrl: queueURL,
        MessageBody: message,
        MessageGroupId: msgType
      };
      this.sqs.sendMessage(params, function(err, data) {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }

  receiveMessage(queueURL, maxNumberOfMessages) {
    return new Promise((resolve, reject) => {
      let visibilityTimeoutInSecs =
        (config.get("aws.sqs_polling_interval_in_mins") + 5) * 60;
      let params = {
        QueueUrl: queueURL,
        VisibilityTimeout: visibilityTimeoutInSecs,
        MaxNumberOfMessages: maxNumberOfMessages
      };
      this.sqs.receiveMessage(params, function(err, data) {
        if (err) {
          return reject(err);
        } else {
          let messages = data["Messages"] ? data["Messages"] : [];
          return resolve(messages);
        }
      });
    });
  }

  deleteMessage(queueURL, message) {
    return new Promise((resolve, reject) => {
      let params = {
        QueueUrl: queueURL,
        ReceiptHandle: message["ReceiptHandle"]
      };
      this.sqs.deleteMessage(params, function(err, data) {
        if (err) {
          Log.error(err);
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }

  extendVisibiltyTimeout(queueURL, messages) {
    return new Promise((resolve, reject) => {
      let visibilityTimeoutInSecs =
        (config.get("aws.sqs_polling_interval_in_mins") + 5) * 60;

      let entries = [];
      for (let message of messages) {
        entries.push({
          Id: message["MessageId"],
          ReceiptHandle: message["ReceiptHandle"],
          VisibilityTimeout: visibilityTimeoutInSecs
        });
      }
      let params = {
        Entries: entries,
        QueueUrl: queueURL
      };
      this.sqs.changeMessageVisibilityBatch(params, function(err, data) {
        if (err) {
          Log.error(err);
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }
}

module.exports = AWSSQS;
