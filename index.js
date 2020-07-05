
// AL third parties
var Regex = require("regex");
var inquirer = require('inquirer');
var chalk = require('chalk');

var current;

var changeRegex = function() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'regex',
      default: ''
    }
  ]).then(function(results) {
    try {
      current = new Regex(results.regex);
    } catch(e) {
      console.error(e);
      console.log(chalk.red('not proepr'));
      changeRegex();
    }

    inquirer.prompt([
      {
        type: 'list',
        name: 'activity',
        choices: [
          'Edit',
          'Test'
        ]
      }
    ]).then(function(resultsAct) {
      switch (resultsAct.activity) {
        case 'Edit':
          console.log('Edit');
          break;
        case 'Test':
          console.log('Test');
          inquirer.prompt([
            {
              type: 'input',
              name: 'test',
              default: ''
            }
          ]).then(function(results) {
            if (current.test(results.test)) {
              console.log('PASS test');
            } else {
              console.log('FAIL test');
            }
          });
          break;
      }
    });

  });

};

changeRegex();
