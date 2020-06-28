"use strict";

class Dictionary {
  constructor() {
    var _keys = {};

    this.set = function (key, value, retrieved = false) {
      _keys[key] = {value: value, retrieved: retrieved};
    }

    this.get = function (key) {
      return _keys[key];
    }
  }
}

module.exports = Dictionary;