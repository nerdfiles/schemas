/**
 * @fileOverview ./index.js
 * @description
 * Schema.org searcher.
 */
'use strict';

let got = require('got');
let cheerio = require('cheerio');
let docopt = require('docopt');
let _ = require('lodash');
let chalk = require('chalk');

(async function () {
  function __parser__ (f) {
    return f.toString()
      .replace(/^[^\/]+\/\*!?/, '')
      .replace(/\*\/[^\/]+$/, '');
  }

  let doc = __parser__ (function() {/*!
  Usage:
    schemas search <term> [--timeout=<seconds>]
    schemas show <concept> [--timeout=<seconds>]
    schemas add <schema_url>
    schemas generate <schema>
    schemas -h | --help | --version
  */});

  let initConfig = docopt.docopt(doc, { version: '0.1.1rc' });
  console.log({initConfig});

  /**
   * @see http://schema.org/docs/schema_org_rdfa.html (Reflection)
   * @see http://schema.rdfs.org/all.json [Unavailable]
   */
  let defaultOpts = {
    'search'       : false,
    '<term>'       : null,
    'show'         : false,
    '<concept>'    : null,
    'add'          : false,
    '<schema_url>' : null,
    'generate'     : false,
    '<schema>'     : null,
    '-h'           : false,
    '--help'       : false,
    '--version'    : false
  }
  let opts = initConfig || defaultOpts;

  var url = 'http://localhost:8000/rdfa.html';
  url = 'https://staging.emscharts.com/dba/meta.cfm';
  url = 'https://schema.org/docs/schemas.html';
  if (opts && opts['<concept>']) {
    url = opts['<concept>'];
  }

  var res;
  let $;
  try {
    res = await got(url);

    if (res.body) {
      var html = res.body;
      $ = cheerio.load(html);
      let schemaResults = {};
      let zollResults = {};

      if (html.includes('schema.org')) {
        schema_org();
      } else {
        zoll();
      }
      console.log(chalk.green(html));
      let jsonSchemaResults = JSON.stringify(schemaResults);
      console.log(chalk.blue(jsonSchemaResults));
    }
  } catch (e) {
    console.log(e);
  }

  function zoll () {
    $('a[property="rdfs:subClassOf"]').each(function (i, element) {
      let a = $(this);
      let rdfsSubclassOf = a.parent().parent();
      let rdfsSubclassOf_Title = a.text();
      let rdfsSubclassOf_Url = a.attr('href');
      let rdfsClass = rdfsSubclassOf.children('.h').text();
      if (opts.search && rdfsClass.includes(opts['<term>'])) {
        console.log(rdfsClass);
      } else {
        return console.error(res);
      }
      let rdfsComment = rdfsSubclassOf.children('[property="rdfs:comment"]');
      let metadata = {
        rdfsClass   : rdfsClass,
        rdfsComment : rdfsComment.text(),
        rdfsSubClassOf : {
          title : rdfsSubclassOf_Title,
          url   : rdfsSubclassOf_Url
        }
      };
      schemaResults["$" + rdfsClass] = metadata;
    })
  }

  function schema_org () {
    $('a[property="rdfs:subClassOf"]').each(function (i, element) {
      let a = $(this);
      let rdfsSubclassOf = a.parent().parent();
      let rdfsSubclassOf_Title = a.text();
      let rdfsSubclassOf_Url = a.attr('href');
      let rdfsClass = rdfsSubclassOf.children('.h').text();
      if (opts.search && rdfsClass.includes(opts['<term>'])) {
        console.log(rdfsClass);
      } else {
        return console.error(res);
      }
      let rdfsComment = rdfsSubclassOf.children('[property="rdfs:comment"]');
      let metadata = {
        rdfsClass   : rdfsClass,
        rdfsComment : rdfsComment.text(),
        rdfsSubClassOf : {
          title : rdfsSubclassOf_Title,
          url   : rdfsSubclassOf_Url
        }
      };
      schemaResults["$" + rdfsClass] = metadata;
    })
  }
})();

