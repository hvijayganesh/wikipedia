"use strict";
const Enum = require('../common/enums');

class Paragraph {
  constructor() {
    var _text = "";
  
    this.construct = function(data) {
      _text = _text.concat(data.toLowerCase());
    }

    this.get = function () {
      return _text;
    }

    this.findSentenceOffset = function(sent, startPosition, last = false) {
      if (last)
        return _text.lastIndexOf(sent, startPosition)
      return _text.indexOf(sent, startPosition)
    }
  }

  getDelimiters() {
    return Enum.ParaDelimiters;
  }
}

module.exports = Paragraph;