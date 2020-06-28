const WikipediaService = require('../../lib/service/wikipedia-service');
const utils = require('../../lib/helpers/utils');
const path = require('path');
const expect = require('chai').expect;
const _ = require('lodash');


describe('Find Answers for the questions', function() {
  let input;
  beforeEach(function () {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input.txt'));
    utils.initOutputFile(path.join(__dirname, '../test-data/output.txt'));
    utils.clearFileContents();
  });

  it('findAnswers', function() {
    const wikiService = new WikipediaService(input);
    let answers = wikiService.findAnswers();
    let actual = [];
    _.each(answers, (ans) => {
      actual.push(ans.getActualText())
    })
    let expected = [" Grévy's zebra and the mountain zebra","aims to breed zebras that are phenotypically similar to the quagga","horses and donkeys"," the plains zebra, the Grévy's zebra and the mountain zebra","subgenus Hippotigris"]
    expect(actual).to.eql(expected)
  })
  
});


describe('Wikipedia service', function() {
  let input;
  beforeEach(function () {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input.txt'));
  });

  it('_findOccurencesOfJumbledAnswers', function() {
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();

    wikiService._findOccurencesOfJumbledAnswers();
    let expected = [
      [" the plains zebra and the mountain zebra belong to the subgenus hippotigris but grévy's zebra is the sole species of subgenus dolichohippus"],
      [" there are three species of zebras the plains zebra the grévy's zebra and the mountain zebra"],
      [" unlike their closest relatives horses and donkeys zebras have never been truly domesticated"],
      [" though there is currently a plan called the quagga project that aims to breed zebras that are phenotypically similar to the quagga in a process called breeding back"],
      [" there are three species of zebras the plains zebra the grévy's zebra and the mountain zebra"," grévy's zebra and the mountain zebra are endangered"]
    ]
    for (let i=0; i<expected.length; i++) {
      expect(wikiService.answers[i].getOccurences()).to.be.eql(expected[i])
    }
  })

  it('_findOccurencesOfJumbledAnswers - No occurences found in the para', function() {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input-1.txt'));
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();

    wikiService._findOccurencesOfJumbledAnswers();
    for (let i=0; i< wikiService.answers.length; i++) {
      expect(wikiService.answers[i].getOccurences().length).to.be.eql(0)
    }
  })

  it('_cleanUpQuestions', function() {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input-2.txt'));
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();

    wikiService._cleanUpQuestions();
    let expected = " zebras  endangered";
    expect(wikiService.questions[0].get()).to.be.eql(expected)
  })

  it('_cleanUpQuestions - No usual words present', function() {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input-3.txt'));
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();

    wikiService._cleanUpQuestions();
    let expected = "good question ";
    expect(wikiService.questions[0].get()).to.be.eql(expected)
  })

  it('_findBestAnswer', function() {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input.txt'));
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();
    wikiService._findOccurencesOfJumbledAnswers();
    wikiService._cleanUpQuestions();

    wikiService._findBestAnswer();
    for (let i=0; i< wikiService.answers.length; i++) {
      expect(wikiService.answers[i].getQNo()).to.be.eql(i)
    }
  })

  it('_findBestAnswer - No exact matching answer found for one question', function() {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input-4.txt'));
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();
    wikiService._findOccurencesOfJumbledAnswers();
    wikiService._cleanUpQuestions();

    wikiService._findBestAnswer();
    expect(wikiService.answers[0].getQNo()).to.be.eql(0); // match found
    expect(wikiService.answers[4].getQNo()).to.be.eql(4); // looks for closest match
  })

  it('_findBestAnswer - One new question added', function() {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input-5.txt'));
    const wikiService = new WikipediaService(input);
    wikiService._processInputText();
    wikiService._findOccurencesOfJumbledAnswers();
    wikiService._cleanUpQuestions();

    wikiService._findBestAnswer();
    expect(wikiService.answers[0].getQNo()).to.be.eql(0); // match found
    expect(wikiService.answers[4].getQNo()).to.be.eql(4); // looks for closest match
  })
  
})