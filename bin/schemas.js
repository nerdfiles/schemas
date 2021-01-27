#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var schemas = require('../index.js');
var __type = 'utf-8';

var opts = require("nomnom")
  .option('version', {
    flag: true,
    help: 'Print version and exit.',
    callback: function () {
      fs.readFile(path.resolve(__dirname, '../package.json'), __type, function (err, file) {
        console.log(JSON.parse(file).version);
      });
    }
  })
  .parse();
