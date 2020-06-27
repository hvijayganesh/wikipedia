'use strict'
const Enums = require('../common/enums');

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

}

module.exports = WordProcessor;