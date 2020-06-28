'use strict'
const Enums = require('../common/enums');
const Dictionary = require('../models/dictionary');
const _ = require('lodash');


class WordProcessor {
  constructor() {}

  removeCleanUpWords(text) {
    for(let i = 0, str; str = Enums.CleanUpWords[i]; i++) {
      let strRegExPattern = '\\b'+str+'\\b'; 
			text = text.replace(new RegExp(strRegExPattern,'g'), '');
    }
    return text;
  }

  removePlurals(text) {
    let strRegExPattern = '['+Enums.PluralSuffixes+']$'; 
    text = text.replace(new RegExp(strRegExPattern), '');
    return text;
  }

  // Function to return the count of
  // common words in the sentences
  commonWords(sentence1, sentence2) {
    if (!sentence1 || !sentence2)
      return 0;
    let count = 0;
    let dictionary = new Dictionary();
    sentence1.split(' ').forEach(word => {
      if (word) {
        word = this.removePlurals(word);
        dictionary.set(word, word);
      }
    })
    sentence2.split(' ').forEach(word => {
      word = this.removePlurals(word);
      if ( word &&
        _.get(dictionary.get(word), 'value', '') == word &&
        _.get(dictionary.get(word), 'retrieved', '')  == false ) {
        count++;

        // mark the word as retrieved so that its not counted again
        dictionary.set(word, word, true);
        console.log('find match: |' + word + '|');
      }
    })
    return count;
  }

}

module.exports = WordProcessor;