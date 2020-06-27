"use strict";

class Dictionary {
  constructor() {
    var _text = "";

    this.frame = function (data) {
      _text = data.toLowerCase();;
    }

    this.get = function () {
      return _text;
    }
  }
}

module.exports = Dictionary;