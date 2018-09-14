"use strict";
const cleanStack = require("clean-stack");
const moment = require("moment");
const colors = require("colors");

const Logger = {
  colorize: function(args, color) {
    //available colors
    //black, red, green, yellow, blue, cyan, magenta, white
    let coloredArgs = [];
    for (let i in args) {
      let arg = args[i];
      if (typeof arg == "string") {
        coloredArgs[i] = arg[color];
      } else {
        coloredArgs[i] = arg;
      }
    }

    return coloredArgs;
  },
  info: function(...args) {
    Logger._log("INFO", args);
  },
  warn: function(...args) {
    for (let i in args) {
      let arg = args[i];
      if (arg instanceof Error) {
        if (i == 0) {
          args[i] = cleanStack(arg.stack) + "\n";
        } else {
          args[i] = "\n" + cleanStack(arg.stack) + "\n";
        }
      }
    }
    Logger._log("WARN", args);
  },
  debug: function(...args) {
    //Debug has to be enabled in nodejs
    Logger._log("DEBUG", args);
  },
  error: function(...args) {
    console.error(
      "======================================================================="
    );
    for (let i in args) {
      let arg = args[i];
      if (arg instanceof Error) {
        if (i == 0) {
          args[i] = cleanStack(arg.stack) + "\n";
        } else {
          args[i] = "\n" + cleanStack(arg.stack) + "\n";
        }
      }
    }
    Logger._log("ERROR", args);
  },
  logWithLevel: function(logLevel, ...args) {
    Logger._log(logLevel, args);
  },
  _log: function(logLevel, args) {
    if (!(args && args[0])) {
      args = [""];
    }
    if (typeof args[0] !== "string") {
      args = ["", ...args];
    }
    args[0] =
      "[" +
      moment().format("DD-MM-YYYY HH:mm:ss") +
      "]" +
      logLevel +
      ": " +
      args[0];

    let consoleLogLevel = logLevel.toLowerCase();

    //apply color for Error and Warning
    let colorLogLevels = { error: "red", warn: "yellow", debug: "cyan" };
    if (colorLogLevels[consoleLogLevel]) {
      args = Logger.colorize(args, colorLogLevels[consoleLogLevel]);
    }

    if (console[consoleLogLevel]) {
      console[consoleLogLevel].apply(console, args);
    } else {
      console.log.apply(console, args);
    }
  }
};

module.exports = Logger;
