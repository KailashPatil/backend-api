"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/..");

const AuditLogModel = require(srcDir + "/model/season/audit_log");
const TxnLogModel = require(srcDir + "/model/season/txn_log");

const restify = require("restify");
const _ = require("underscore");

const AuditLogUtil = {
  isValidationError(e) {
    if (e.code == 405) {
      return false;
    }

    let errCode = Math.floor(e.code / 100);
    return errCode == 4;
  },
  obscureCredentials(params) {
    let obscFields = [
      "password",
      "pass",
      "authorization",
      "x-secret-token",
      "token",
      "hash",
      "password_hash"
    ];
    for (let f of obscFields) {
      if (params[f]) {
        params[f] = "********";
      }
    }
    return params;
  },
  async log(req, res, err) {
    try {
      if (err && !AuditLogUtil.isValidationError(err)) {
        //Capture any error other than validation errors
        Log.error(err);
        if (Raven) {
          if (err.message) {
            err.message = `[${global.ENVIRONMENT.toUpperCase()}]${err.message}`;
          }
          Raven.captureException(err);
        }
      }
      let body = null;
      let errorObj = null;

      if (err) {
        errorObj = err;
      } else if (body instanceof Error) {
        errorObj = body;
      }
      if (errorObj) {
        body = {
          error: true,
          message: err.message,
          stack: err.stack
        };
      } else {
        body = res._body;
      }

      // #Response time
      let latency = process.hrtime(req.time());
      latency = latency[1] / 1000000;

      let path = req.getPath();

      let user = { role: "guest" };
      if (req.user) {
        user = {
          id: req.user._id,
          role: req.user.roles,
          email: req.user.email
        };
      } else if (req.app_detail) {
        user = req.app_detail;
      }

      let params = {};
      if (req.params) {
        params = AuditLogUtil.obscureCredentials(req.params);
      }
      let headers = AuditLogUtil.obscureCredentials(req.headers);
      let response = {};

      let noBodyLogs = [
        "/product",
        "/published-product",
        "/published-file",
        "/item",
        "/color"
      ];
      let isNotBodyLoggable = _.find(noBodyLogs, function(value) {
        return path.startsWith(value);
      });
      if (!isNotBodyLoggable) {
        if (body) {
          response = AuditLogUtil.obscureCredentials(body);
        }
      }

      let remoteAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      let logFields = {
        logged_dt: new Date(),
        remote_address: remoteAddress,
        path: path,
        method: req.method,
        user: user,
        params: params,
        headers: headers,
        status_code: res.statusCode,
        response_length: res.header("Content-Length"),
        response_time: latency,
        response: response,
        txn_id: headers["txn-id"]
      };
      let txnFields = {
        txn_id: headers["txn-id"],
        txn_action: headers["txn-action"],
        user: user
      };
      let season = req.params ? req.params["season"] : "";
      if (_.isEmpty(season)) {
        if (["/", "/favicon.ico"].indexOf(path) == -1) {
          //Do not log for the call that doesn't require season
          Log.warn(
            "Audit Log: Season is not defined",
            req.method,
            path,
            params,
            remoteAddress
          );
        }
      } else {
        let noLogs = ["/audit-logs", "/worker-server-logs"];
        let isNotLoggable = _.find(noLogs, function(value) {
          return path.startsWith(value);
        });

        let noTxnActionLogs = ["get_audit_logs", "get_audit_log"];
        let isNotTxnLoggable = _.find(noTxnActionLogs, function(value) {
          let txnAction = headers["txn-action"];
          if (_.isEmpty(txnAction)) {
            return false;
          }
          return txnAction.startsWith(value);
        });
        if (req.valid_season && !isNotLoggable) {
          try {
            let auditLogModel = new AuditLogModel(season);
            if (!isNotTxnLoggable) {
              let txnLogs = await AuditLogUtil.logTxns(txnFields, season);
            }
            await auditLogModel.create(logFields);
          } catch (e) {
            Log.error(path, e);
          }
        }
      }
    } catch (e) {
      Log.error(e);
      if (Raven) {
        if (e.message) {
          e.message = `[${global.ENVIRONMENT.toUpperCase()}]${e.message}`;
        }
        Raven.captureException(e);
      }
    }
  },
  async logTxns(txnFields, season) {
    if (_.isEmpty(txnFields["txn_id"])) {
      return;
    }
    let txnLogModel = new TxnLogModel(season);
    let filters = {
      txn_id: txnFields["txn_id"]
    };
    let txnDetails = await txnLogModel.get(filters);
    if (txnDetails) {
      if (
        !_.isEmpty(txnFields["txn_action"]) &&
        txnDetails["txn_action"] != txnFields["txn_action"]
      ) {
        //Last action will have more meaning than first one
        let txnLogs = await txnLogModel.update(filters, {
          txn_action: txnFields["txn_action"]
        });
        return txnLogs;
      }
    } else {
      let txnLogs = await txnLogModel.create(txnFields);
      return txnLogs;
    }
  }
};

module.exports = AuditLogUtil;
