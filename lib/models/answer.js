"use strict";

class Answer {
  constructor() {
    var _text = "";
    var _actualText = "";
    var _forQuestionNo = 0;
    var _occurences = [];

    this.set = function (data) {
      _text = data.text.toLowerCase();
      _actualText = data.text;
      _forQuestionNo = data.totalQuestions;
    }

    this.getText = function () {
      return _text;
    }

    this.getOccurences = function () {
      return _occurences;
    }

    this.getOccurenceCount = function () {
      return _occurences.length;
    }

    this.setOccurence = function (occ) {
      _occurences.push(occ);
    }

    this.setQNo = function (no) {
      _forQuestionNo = no;
    }

    this.getQNo = function() {
      return _forQuestionNo;
    }
  }

}

module.exports = Answer;