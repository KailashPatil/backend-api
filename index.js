"use strict";
const path = require("path");
const srcDir = path.resolve(__dirname + "/src");

const config = require("config");
global.ENVIRONMENT = config.util.getEnv("NODE_ENV");
global.IS_TEST_ENVIRONMENT = ["development", "test"].indexOf(ENVIRONMENT) > -1;

global.Log = require(srcDir + "/lib/logger");

//For the MongoDB connections pool
global.DB_CONNECTIONS = {};

const restify = require("restify");

const serverOpts = {
  name: "Backend API"
  // handleUncaughtExceptions: true
};
let restServer = restify.createServer(serverOpts);

const corsMiddleware = require("restify-cors-middleware");
const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ["*"]
});
restServer.pre(cors.preflight);
restServer.use(cors.actual);

const fs = require("fs-extra");
let uploadDir = config.get("directory.tmp") + "/uploads";
fs.ensureDirSync(uploadDir);

restServer.use(restify.plugins.queryParser());
restServer.use(
  restify.plugins.bodyParser({
    uploadDir: uploadDir,
    multiples: true
  })
);

// For mongodb sanitization
const sanitizeMiddleware = require(srcDir + "/lib/sanitize").sanitizeMiddleware;
restServer.use(sanitizeMiddleware());

require(srcDir + "/version_api")(restServer);

const ErrorHandler = require(srcDir + "/util/error_handler");
restServer.on("MethodNotAllowed", ErrorHandler.unknownMethodHandler);
restServer.on("restifyError", ErrorHandler.handleException);
restServer.on("uncaughtException", ErrorHandler.uncaughtException);
restServer.on("NotFound", ErrorHandler.notFound);

restServer.listen(config.get("backend_api.port"), function() {
  Log.info(
    "Clarks api listening at port " +
      config.get("backend_api.port") +
      " and url " +
      config.get("backend_api.url")
  );
});
