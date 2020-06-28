const WordProcessor = require('../../lib/service/word-processor');
const path = require('path');
const expect = require('chai').expect;

describe('Find Answers for the questions', function() {

  it('commonWords', function() {
    let sent1 = 'while plains zebras are much more plentiful one subspecies - the quagga - became extinct in the late 19th century';
    let sent2 = 'quagga became extinct';
    const processor = new WordProcessor();
    let actualCount = processor.commonWords(sent1, sent2);
    expect(actualCount).to.eql(3)
  })

  it('commonWords - No match found', function() {
    let sent1 = 'while plains zebras are much more plentiful one subspecies - the quagga - became extinct in the late 19th century';
    let sent2 = 'there is currently a plan';
    const processor = new WordProcessor();
    let actualCount = processor.commonWords(sent1, sent2);
    expect(actualCount).to.eql(0)
  })

  it('commonWords - one input not given', function() {
    let sent1 = 'while plains zebras are much more plentiful one subspecies - the quagga - became extinct in the late 19th century';
    const processor = new WordProcessor();
    let actualCount = processor.commonWords(sent1);
    expect(actualCount).to.eql(0)
  })
  
});