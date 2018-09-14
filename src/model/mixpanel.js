"use strict";

const Mixpanel = require("mixpanel");
const config = require("config");
const mixpanel = Mixpanel.init(config.get("mixpanel.token"));

const ClarksMixpanel = {
  isMixpanelConfigured: () => {
    return (
      config.has("mixpanel.token") &&
      config.util.getEnv("NODE_ENV") !== "development"
    );
  },
  trackCustMail: (props = {}) => {
    if (!ClarksMixpanel.isMixpanelConfigured()) {
      return;
    }

    props["to"] = "customer";
    mixpanel.track("Export List Email", props);
  },
  trackUserMail: (props = {}) => {
    if (!ClarksMixpanel.isMixpanelConfigured()) {
      return;
    }

    props["to"] = "user";
    mixpanel.track("Export List Email", props);
  },
  trackEmailLinkClick: (props = {}) => {
    if (!ClarksMixpanel.isMixpanelConfigured()) {
      return;
    }

    mixpanel.track("Email Link Click", props);
  },
  getEmailLinkClickTrackURL: (linkType, redirectUrl, props = {}) => {
    if (!ClarksMixpanel.isMixpanelConfigured()) {
      return redirectUrl;
    }

    linkType = encodeURIComponent(linkType);
    let returnLink = "#{conf.get('service_app_url')}/analytics/#{linkType}";

    redirectUrl = encodeURIComponent(redirectUrl);
    returnLink += "?redirect=" + redirectUrl;

    let queryString = "";
    if (props) {
      for (let key in props) {
        queryString += `&extra[${key}]=${props[key]}`;
      }

      returnLink += queryString;
    }

    return returnLink;
  }
};

module.exports = ClarksMixpanel;
