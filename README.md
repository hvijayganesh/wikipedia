# Wikipedia

### Installation

Wikipedia requires [Node.js](https://nodejs.org/) v12.14.0 to run.

Install the dependencies and devDependencies.

```sh
$ cd wikipedia
$ npm install
```

### How to run the program ? 

```sh
$ npm test
```

Main test case which solves the use-case of the problem is 'findAnswers'

Input: ```tests/test-data/input.txt```
Output: ```tests/test-data/output.txt```

### Troubleshoot Guide

If any issues happened during running the test, paste the following snippet in 'lib/service/wikipedia-service.js' and run the program in command line

```const path = require('path');
let input = Utils.readInputFile(path.join(__dirname, '../../tests/test-data/input.txt'));
Utils.initOutputFile(path.join(__dirname, '../../tests/test-data/output.txt'));
Utils.clearFileContents();
let wiki = new WikipediaService(input);
wiki.findAnswers();```

```$ node lib/service/wikipedia-service.js```
