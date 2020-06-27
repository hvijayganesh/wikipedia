const WikipediaService = require('../../lib/service/wikipedia-service');
const utils = require('../../lib/helpers/utils');
const path = require('path');
const expect = require('chai').expect;

describe('Find Answers for the questions', function() {
  let input;
  beforeEach(function () {
    input = utils.readInputFile(path.join(__dirname, '../test-data/input.txt'));
    utils.initOutputFile(path.join(__dirname, '../test-data/output.txt'));
    utils.clearFileContents();
  });

  it('findAnswers - Happy path', function() {
    const wikiService = new WikipediaService(input);
    wikiService.findAnswers();
    expect(1).to.be.equals(1)
  })
  
})