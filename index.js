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
  let schemaResults = {};
  let zollResults = {};

  function __parser__ (f) {
    return f.toString()
      .replace(/^[^\/]+\/\*!?/, '')
      .replace(/\*\/[^\/]+$/, '');
  }

  function zoll () {
    var list = []
    $('td').each(function (i, element) {
      var td = $(this);
      var metadata = {
        td: td
      };
      zollResults['foundalink'] = metadata;
      try {
        let jsonZollResults = JSON.stringify(zollResults);
      } catch (e) {
        console.error(e);
      }
      console.log(chalk.blue(jsonZollResults));
      list.push(jsonZollResults);
    })
    console.log(list && list.length ? list[0] : []);
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
      let jsonSchemaResults = JSON.stringify(schemaResults);
      console.log(chalk.blue(jsonSchemaResults));
    })
  }

  function __init__ (element) {
    return function (lineRef) {
      return lineRef && lineRef.includes(element);
    }
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
    console.log(':', url);
  }

  var res;
  let $;

  try {
    res = await got(url);

    if (res.body) {
      var html = res.body;
      $ = cheerio.load(html);
      var z = html.split(' ');
      var ensemble;
      var script;
      var div;

      var DOCTYPE = /DOCTYPE (\w+)/.test(z.join(' '));
      console.log(z.join(' ').match(/DOCTYPE (\w+)/));
      var init = function (__type) {
        console.log(__type);
        var dict = {
          'DOCTYPE html': function () {
            return function () {
              return 'modern html';
            }
          }
        };
        return dict[__type]();
      };
      var s = init(DOCTYPE);
      console.log(s());

      ensemble = z.some(__init__('zollonline.com'));
      console.log('found zollonline', ensemble && ensemble.length ? ensemble : []);

      div = z.some(__init__('div'));
      console.log('found div\'s', div);

      script = z.some(__init__('script'));
      console.log('found scripts', script);

      if (z && z.length) {
        zoll();
      } else {
        schema_org();
      }
      console.log('END');
    }
  } catch (e) {
    console.log(e);
  }
})();

