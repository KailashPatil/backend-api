"use strict";

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const config = require("config");
const _ = require("underscore");

const MailSender = {
  getTransporter: () => {
    const auth = {
      auth: {
        api_key: config.get("email.mailgun.api_key"),
        domain: config.get("email.mailgun.domain")
      }
    };

    return nodemailer.createTransport(mg(auth));
  },
  send: function(html, values) {
    return new Promise((resolve, reject) => {
      let transporter = MailSender.getTransporter();
      let mailOptions = {
        from: config.get("email.from"),
        to: values["to"],
        subject: values["subject"],
        html: html
      };

      Log.info(
        "Sending email with following options",
        mailOptions["to"],
        mailOptions["subject"]
      );

      // if (config.util.getEnv("NODE_ENV") == "development") {
      //   const fs = require("fs-extra");
      //   let tmpPath =
      //     config.get("directory.tmp") + "/email/" + mailOptions["to"] + ".html";
      //   fs.outputFileSync(tmpPath, html);
      //   Log.info("DEV ENV Physically Not sent");
      //   return resolve();
      // }

      transporter.sendMail(mailOptions, e => {
        if (e) {
          return reject(e);
        }
        Log.info("==================Sent==========================");
        return resolve();
      });
    });
  }
};

module.exports = MailSender;
