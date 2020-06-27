"use strict";
const _ = require('lodash');
const Question = require('../models/question');
const Paragraph = require('../models/paragraph');
const Answer = require('../models/answer');
const Errors = require('../common/errors');
const Utils = require('../helpers/utils');
const WordProcessor = require('./word-processor');
const AnswerComparator = require('../models/answer-comparator');

class WikipediaService {
  constructor(input) {
    this.input = input;
    this.para = new Paragraph();
    this.questions = [];
    this.answers = [];
    this.wordProcessor = new WordProcessor();
    this.answerComparator = new AnswerComparator();
  }

  findAnswers() {
    this._processInputText();
    this._findOccurencesOfJumbledAns();
    this._cleanUpQuestions();
    this._findBestAnswer();
  }

  _findBestAnswer() {
    this.answers = this.answers.sort(this.answerComparator.sortByOccurenceCount);
    for(let qInd = 0; qInd < this.questions.length; qInd++) {
      let bestAnswer = -1;
      let maxCount = 0;
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n');
          console.log(this.questions[qInd].get());
      for(let aInd = 0; aInd < this.answers.length; aInd++) {
        let ans = this.answers[aInd];
        if (ans.getQNo() < this.questions.length) continue;
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n');
        console.log(ans.getOccurences());
        for(let k = 0, occ; occ = ans.getOccurences()[k]; k++) {
          let count = this._findMatch(this.questions[qInd].get(), occ);
                  if(count) {
                      console.log('--------------------------------------------');
                      console.log(count, maxCount);
                      console.log(occ);
                      console.log('============================================');
                  }
          if(count > maxCount) {
            maxCount = count;
            bestAnswer = aInd;
          }
        }
      }
      if (bestAnswer > -1)
        this.answers[bestAnswer].setQNo(qInd);
    }
    this.answers = this.answers.sort(this.answerComparator.sortByQuestionNo);
  }

  _findMatch(question, answer) {
    let count = 0;
    let quesWords = question.split(' ');
    let ansWords = answer.split(' ');
  
    for(let i = 0, word1; (word1 = quesWords[i]) != null; i++) {
      let words = {};
      if(!word1 || words[word1]) continue;
      words[word1] = true;
      word1 = this.wordProcessor.removePlurals(word1);
      for(let j = 0, word2; (word2 = ansWords[j]) != null; j++) {
        word2 = this.wordProcessor.removePlurals(word2);
        if(!word2) continue;
        if(word1 == word2) {
          count++;
          console.log('find match: |' + word1 + '|');
          break;
        }
      }
    }
    return count;
  }

  _cleanUpQuestions() {
    for(let i = 0; i < this.questions.length; i++) {
      let questionText = this.questions[i].get();
      questionText = Utils.cleanText(questionText);
      questionText = this.wordProcessor.removeCleanUpWords(questionText);
      this.questions[i].set(questionText);
    }
  }

  _findOccurencesOfJumbledAns() {
    let delimiters = this.para.getDelimiters();
    for(let i = 0; i < this.answers.length; i++) {
      let start = 0, index;
      let ans = this.answers[i];
      while ((index = this.para.findSentenceOffset(ans.getText(), start)) != -1) {
        let begin = -1, end = Number.MAX_VALUE, tmp;
        for(var j = 0, d; d = delimiters[j]; j++) {
          if((tmp = this.para.findSentenceOffset(d, index)) != -1) end = Math.min(tmp, end);
          if((tmp = this.para.findSentenceOffset(d, index, true)) != -1) begin = Math.max(tmp, begin);
        }
        ans.setOccurence(Utils.cleanText(this.para.get().substring(begin + 1, end)));
        start = index + 1;
      }
    }
  }

  _processInputText() {
    let data = this.input.split('\n');
    data = this._initParas(data);
    data = this._initQuestions(data);
    this._initAnswers(data);
  }

  _initParas(parsedInput) {
    let i;
    for (i = 0; i < parsedInput.length; i++) {
      if (Utils.isValidQuestion(parsedInput[i]))
        break;
      this.para.construct(parsedInput[i]);
    }
    return _.drop(parsedInput, i);
  }

  _initQuestions(parsedInput) {
    let i;
    for (i = 0; i < parsedInput.length; i++) {
      if (Utils.isValidQuestion(parsedInput[i])) {
        let q = new Question();
        q.frame(parsedInput[i])
        this.questions.push(q);
      } else {
        break;
      }
    }
    return _.drop(parsedInput, i);
  }

  _initAnswers(parsedInput) {
    if (parsedInput.length > 1) {
      throw Errors.InvalidInput;
    } 
    let jumbledAns = parsedInput[0].split(';');
    _.each(jumbledAns, (ans) => {
      let a = new Answer();
      a.set({text: ans, totalQuestions: this.questions.length + 1});
      this.answers.push(a);
    });
  }
}

module.exports = WikipediaService;