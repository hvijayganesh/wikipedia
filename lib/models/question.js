"use strict";

class Question {
  constructor() {
    var _text = "";

    this.frame = function (data) {
      _text = data.toLowerCase();;
    }

    this.get = function () {
      return _text;
    }

    this.set = function(text) {
      _text = text;
    }
  }
}

module.exports = Question;