"use strict";

const Slack = require("node-slack");

const config = require("config");

const slackIcon = ":clarkscollection:";
const channel = config.get("slack.channel");

const username = "Product API Server(" + global.ENVIRONMENT + ")";

const slackHook = config.get("slack.hook_url");
const SlackObj = new Slack(slackHook);

let SlackNotify = {
	send: function(message) {
		if (global.ENVIRONMENT == "development") {
			Log.info("DEV ENV Physically not slacked");
			return Promise.resolve();
		}
		return SlackObj.send({
			username: username,
			text: message,
			channel: channel,
			icon_emoji: slackIcon
		});
	},
	sendError: function(error) {
		let message = error;
		if (error instanceof Error) {
			// message = error.message + "\n" + error.stack + "\n";
			message = error.message;
		}
		return SlackNotify.send(message);
	}
};

module.exports = SlackNotify;
