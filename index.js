/**
 * @fileOverview ./index.js
 * @description
 * Schema.org searcher.
 */

let got = require('got');
let cheerio = require('cheerio');
let docopt = require('docopt');
// let _ = require('lodash');

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
  try {
    res = await got(url);

    if (res.body) {
      var html = res.body;
      let $ = cheerio.load(html);
      let schemaResults = {};

      $('a[property="rdfs:subClassOf"]').each(function (i, element) {
        console.log(element);
        console.log({i});

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

      console.log(html);
      let jsonSchemaResults = JSON.stringify(schemaResults);
      console.log('------------');
      console.log(jsonSchemaResults);
      console.log('------------');
    }
  } catch (e) {
    console.log(e);
  }
})();

