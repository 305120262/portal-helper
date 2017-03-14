define(["exports", "dojo/_base/array","dojo/request"], function (exports, _array, _request) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _request2 = _interopRequireDefault(_request);

  var _array2 = _interopRequireDefault(_array);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  class Portal {
    constructor(config) {
      config = typeof config !== "undefined" ? config : {};
      this.portalUrl = config.url;
      this.username = config.username;
      this.token = config.token;
      this.withCredentials = false;

      this._version().then(response => {
        this.version = response.currentVersion;
      });

      this._self().then(response => {
        this.self = response;
      });
    }

    /**
     * Return the version of the portal.
     */
    _version() {
      return (0, _request2.default)(this.portalUrl + "sharing/rest", {
        method: "GET",
        query: {
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Return the view of the portal as seen by the current user,
     * anonymous or logged in.
     */
    _self() {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/portals/self", {
        method: "GET",
        query: {
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    //  /**
    //   * Generates an access token in exchange for user credentials that
    //   * can be used by clients when working with the ArcGIS Portal API.
    //   */
    generateToken(username, password) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/generateToken", {
        method: "POST",
        data: {
          client: "referer",
          username: username,
          password: password,
          referer: document.URL, // URL of the sending app.
          expiration: 60, // Lifetime of the token in minutes.
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Searches for content items in the portal.
     * The results of a search only contain items that the user
     * (token) has permission to access.
     * Excluding a token will yield only public items.
     */
    search(query, startNum,numResults, sortField, sortOrder) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/search", {
        method: "GET",
        query: {
          q: query,
          start:startNum,
          num: numResults,
          sortField: sortField,
          sortOrder: sortOrder,
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Get the service endpoints for hosted feature and tile services.
     */
    hostingUrls() {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/portals/" + this.id + "/urls?", {
        method: "GET",
        query: {
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     *
     */
    userProfile(username) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/community/users/" + username, {
        method: "GET",
        query: {
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     *
     */
    userContent(username, folder) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/users/" + username + "/" + folder, {
        method: "GET",
        query: {
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     *
     */
    itemDescription(id) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/items/" + id, {
        method: "GET",
        query: {
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     *
     */
    itemData(id) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/items/" + id + "/data", {
        method: "GET",
        query: {
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Create a new item.
     */
    addItem(username, folder, description, data, thumbnailUrl) {
      /**
       * Clean up description items for posting.
       * This is necessary because some of the item descriptions
       * (e.g. tags and extent) are returned as arrays, but the post
       * operation expects comma separated strings.
       */
      _array2.default.forEach(description, function (item, value) {
        if (value === null) {
          description[item] = "";
        } else if (value instanceof Array) {
          description[item] = value.toString();
        }
      });

      var params = {
        item: description.title,
        text: JSON.stringify(data), // Stringify the Javascript object so it can be properly sent.
        overwrite: false, // Prevent users from accidentally overwriting items with the same name.
        thumbnailurl: thumbnailUrl,
        f: "json",
        token: this.token
      };
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/users/" + username + "/" + folder + "/addItem", {
        method: "POST",
        //      data: lang.mixin(description, params), // Merge the description and params objects.
        data: Object.assign(description, params), // Merge the description and params objects.
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Update the content in a web map.
     */
    updateWebmapData(username, folder, id, data) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/users/" + username + "/" + folder + "/items/" + id + "/update", {
        method: "POST",
        data: {
          text: JSON.stringify(data), // Stringify the Javascript object so it can be properly sent.
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Update the description for an item.
     */
    updateDescription(username, id, folder, description) {
      var postData = description;
      /**
       * Clean up description items for posting.
       * This is necessary because some of the item descriptions
       * (e.g. tags and extent) are returned as arrays, but the post
       * operation expects comma separated strings.
       */
      _array2.default.forEach(postData, function (item, value) {
        if (value === null) {
          postData[item] = "";
        } else if (value instanceof Array) {
          postData[item] = value.join(",");
        }
      });
      postData.token = this.token;
      postData.f = "json";
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/users/" + username + "/" + folder + "/items/" + id + "/update", {
        method: "POST",
        data: postData,
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     *
     */
    updateData(username, id, folder, data) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/users/" + username + "/" + folder + "/items/" + id + "/update", {
        method: "POST",
        data: {
          text: data,
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }

    /**
     * Update the URL of a registered service or web application.
     */
    updateUrl(username, folder, id, url) {
      return (0, _request2.default)(this.portalUrl + "sharing/rest/content/users/" + username + "/" + folder + "/items/" + id + "/update", {
        method: "POST",
        data: {
          url: url,
          token: this.token,
          f: "json"
        },
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        },
        withCredentials: this.withCredentials
      });
    }
  }
  exports.default = Portal;
});