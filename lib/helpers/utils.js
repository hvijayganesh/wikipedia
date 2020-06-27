"use strict"
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
var outputFile;

function readInputFile(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}

function initOutputFile(filePath) {
  outputFile = filePath;
}

function printToFile(data) {
  fs.appendFileSync(outputFile, data)
}

function clearFileContents() {
  fs.writeFileSync(outputFile, '')
}

function isValidQuestion(text) {
  if (_.isEmpty(text)) return false;
  return text.indexOf('?') > -1 ? true : false; 
}

function cleanText(text) {
	return text.replace(/[;-\?\.,\(:\)]/g, '');
}

module.exports = {
  readInputFile,
  printToFile,
  initOutputFile,
  clearFileContents,
  isValidQuestion,
  cleanText
}