/**(
 * @fileOverview ./index.js
 * @description
 * Schema.org searcher.
 * )
 */

var request = require('request');
var cheerio = require('cheerio');
var docopt = require('docopt-js');
var _ = require('lodash')

function __parser__ (f) {
  return f.toString().
    replace(/^[^\/]+\/\*!?/, '').
    replace(/\*\/[^\/]+$/, '');
}

var doc = __parser__ (function() {/*!
Usage:
  schemas search <term> [--timeout=<seconds>]
  schemas show <concept> [--timeout=<seconds>]
  schemas add <schema_url>
  schemas generate <schema>
  schemas -h | --help | --version
*/});

function retrieve (config) {
  /**
   * @see http://schema.org/docs/schema_org_rdfa.html (Reflection)
   * @see http://schema.rdfs.org/all.json [Unavailable]
   */
  var defaultOpts = {
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
  };
  var opts = config || defaultOpts;

  return request('http://localhost:8000/rdfa.html', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var schemaResults = {};

      $('a[property="rdfs:subClassOf"]').each(function(i, element){

        var a = $(this);
        var rdfsSubclassOf = a.parent().parent();
        var rdfsSubclassOf_Title = a.text();
        var rdfsSubclassOf_Url = a.attr('href');
        var rdfsClass = rdfsSubclassOf.children('.h').text();
        if (opts.search && rdfsClass.indexOf(opts['<term>']) !== -1) {

        } else {
          return;
        }
        var rdfsComment = rdfsSubclassOf.children('[property="rdfs:comment"]').text();
        var metadata = {
          rdfsClass   : rdfsClass,
          rdfsComment : rdfsComment,
          rdfsSubClassOf : {
            title : rdfsSubclassOf_Title,
            url   : rdfsSubclassOf_Url
          }
        };
        schemaResults["$" + rdfsClass] = metadata;
      });

      jsonSchemaResults = JSON.stringify(schemaResults);
      console.log(jsonSchemaResults);

    }
  });

}

function init () {
  var initConfig = docopt.docopt(doc, { version: '0.0.1' });
  retrieve(initConfig);
}

init();
