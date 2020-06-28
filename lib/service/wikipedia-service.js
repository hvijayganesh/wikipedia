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
    this._findOccurencesOfJumbledAnswers();
    this._cleanUpQuestions();
    this._findBestAnswer();
    this._writeAnswersToFile();
    return this.answers;
  }

  _writeAnswersToFile() {
    for(let i = 0; i < this.answers.length; i++) {
      console.log();
      console.log();
      console.log("text:", this.answers[i].getText());
      console.log("qno:", this.answers[i].getQNo());
      console.log("occurences:", this.answers[i].getOccurences());
      Utils.printToFile(this.answers[i].getActualText() + '\n');
    }
  }

  _findBestAnswer() {
    this.answers = this.answers.sort(this.answerComparator.sortByOccurenceCount);
  
    // iterate through each question and pick best answer using occurences
    for(let qInd = 0; qInd < this.questions.length; qInd++) {
      let bestAnswer = -1;
      let maxCount = 0;
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n');
      console.log(this.questions[qInd].get());
      // for each question iterate every answer object 
      for(let aInd = 0; aInd < this.answers.length; aInd++) {
        let ans = this.answers[aInd];

        // skip if matching question found
        if (ans.getQNo() < this.questions.length) continue;

        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n');
			  console.log(ans.getOccurences());

        // find the best answer amongst the occurences
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

      // set the matching qNo for the best answer
      if (bestAnswer > -1)
        this.answers[bestAnswer].setQNo(qInd);
    }

    // sort the answers based on the question no
    this.answers = this.answers.sort(this.answerComparator.sortByQuestionNo);
  }

  // function will return the count of common words present in question and answer
  _findMatch(question, answer) {
    return this.wordProcessor.commonWords(question, answer);
  }

  // function to remove the usual words in the questions
  // like a, the, what, where etc.
  _cleanUpQuestions() {
    for(let i = 0; i < this.questions.length; i++) {
      let questionText = this.questions[i].get();
      questionText = Utils.cleanText(questionText);
      questionText = this.wordProcessor.removeCleanUpWords(questionText);
      this.questions[i].set(questionText);
    }
  }

  // function to find all the indices of an answer text in the para
  _findOccurencesOfJumbledAnswers() {
    let delimiters = this.para.getDelimiters();

    // start iterating over the answers
    for(let i = 0; i < this.answers.length; i++) {
      let start = 0, index;
      let ans = this.answers[i];

      // match the answer text with the para and store all the occurences found in answer object
      // index denotes the offset of the matching answer text
      while ((index = this.para.findSentenceOffset(ans.getText(), start)) != -1) {
        let begin = -1, end = Number.MAX_VALUE;
        let tmp;

        // parse the matching sentence with the help of the delimiter's index enclosing it
        for(var j = 0, d; d = delimiters[j]; j++) {
          if((tmp = this.para.findSentenceOffset(d, index)) != -1) end = Math.min(tmp, end);
          if((tmp = this.para.findSentenceOffset(d, index, true)) != -1) begin = Math.max(tmp, begin);
        }

        // store each occurence in the answer object
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