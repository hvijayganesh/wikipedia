'use strict';

const BaseClass = require('./answer');

class AnswerComparator extends BaseClass {
  constructor () {
    super();
  }

  sortByOccurenceCount(answer1, answer2) {
    let count1 = answer1.getOccurences().length;
    let count2 = answer2.getOccurences().length;
    if (count1 == count2) {
      return 0;
    } else {
      return count1 < count2 ? -1 : 1;
    }
  }

  sortByQuestionNo(answer1, answer2) {
    if (answer1.getQNo() == answer2.getQNo()) {
      return 0;
    } else {
      return answer1.getQNo() < answer2.getQNo() ? -1 : 1;
    }
  }

  _customSort(a, b) {
    if (a == b) {
      return 0;
    } else {
      return a < b ? -1 : 1;
    }
  }
}

module.exports = AnswerComparator;