
const DEBUG = false;

var RegexParser = require("regex-parser");

const START_OPTS = DEBUG ? {
  slowMo: 250,
  headless: false,
  devtools: true
} : {};

// AL third parties
const puppeteer = require('puppeteer');
var inquirer = require('inquirer');
var chalk = require('chalk');

var current;

var expression;

var validRegexMenu = function() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'activity',
      choices: [
        'Test',
        'Parse',
        'Edit'
      ]
    }
  ]).then(function(resultsAct) {
    switch (resultsAct.activity) {
      case 'Edit':
        console.log('Edit');
        break;
      case 'Parse':
        console.log('Parse');
        // TODO parse expression and explain pieces.
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
          puppeteer.launch(START_OPTS).then(function(browser) {
            browser.newPage().then(function(page) {
              var params = {
                expression: expression,
                test: results.test
              };
              page.evaluate((params) => {
                //debugger;
                var current = new RegExp(params.expression);
                if (current.test(params.test)) {
                  return true;
                } else {
                  return false;
                }
              }, params).then(function(regexTest) {
                if (regexTest) {
                  console.log('PASS test');
                } else {
                  console.log('FAIL test');
                }
                browser.close();
                validRegexMenu();
              });
            });
          });
        });
        break;
    }
  });
};


var changeRegex = function() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'regex',
      default: ''
    }
  ]).then(function(results) {
    expression = results.regex;
    puppeteer.launch(START_OPTS).then(function(browser) {
      var page = browser.newPage().then(function(page) {
        page.evaluate(expression => {
          //debugger;
          let current;
          try {
            current = new RegExp(expression);
            return true;
          } catch (e) {
            return false;
          }
        }, expression).then(function(data) {
          if (!data) {
            changeRegex();
          } else {
            validRegexMenu();
          }
          browser.close();
        });


        // .then(function(result) {
        //   if (!result) {
        //     changeRegex();
        //   } else {
        //     expression = results.regex;
        //     validRegexMenu();
        //   }
        //   browser.close();
        // });
      });
    });
    // try {
    //   current = new Regex(results.regex);
    // } catch(e) {
    //   console.error(e);
    //   console.log(chalk.red('not proepr'));
    //   changeRegex();
    // }


  });

};

changeRegex();
