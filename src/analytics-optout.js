window.allowTracking =
  ["base-xtech.com", "www.base-xtech.com", "staging.base-xtech.com"].includes(
    window.location.hostname,
  ) && localStorage.getItem("analytics_optout") !== "1";
