/**(
 * @fileOverview ./index.js
 * @description
 * Schema.org searcher.
 * )
 */

"use strict"


let got = require('got')
let cheerio = require('cheerio')
let docopt = require('docopt-js')
let _ = require('lodash')

function __parser__ (f) {
  return f.toString().
    replace(/^[^\/]+\/\*!?/, '').
    replace(/\*\/[^\/]+$/, '')
}

let doc = __parser__ (function() {/*!
Usage:
  schemas search <term> [--timeout=<seconds>]
  schemas show <concept> [--timeout=<seconds>]
  schemas add <schema_url>
  schemas generate <schema>
  schemas -h | --help | --version
*/})

let initConfig = docopt.docopt(doc, { version: '0.0.1' })

function retrieve (config) {
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
  let opts = config || defaultOpts

  var url = 'http://localhost:8000/rdfa.html'
  url = 'https://staging.emscharts.com/dba/meta.cfm';

  return got(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html)
      let schemaResults = {}

      $('a[property="rdfs:subClassOf"]').each(function(i, element){

        let a = $(this)
        let rdfsSubclassOf = a.parent().parent()
        let rdfsSubclassOf_Title = a.text()
        let rdfsSubclassOf_Url = a.attr('href')
        let rdfsClass = rdfsSubclassOf.children('.h').text()
        if (opts.search && rdfsClass.indexOf(opts['<term>']) !== -1) {
        } else {
          return
        }
        let rdfsComment = rdfsSubclassOf.children('[property="rdfs:comment"]')
        let metadata = {
          rdfsClass   : rdfsClass,
          rdfsComment : rdfsComment.text(),
          rdfsSubClassOf : {
            title : rdfsSubclassOf_Title,
            url   : rdfsSubclassOf_Url
          }
        }
        schemaResults["$" + rdfsClass] = metadata
      })

      let jsonSchemaResults = JSON.stringify(schemaResults)
      console.log(jsonSchemaResults)
      //retrieve(initConfig)

    }
  })

}

function init () {
  retrieve(initConfig)
}

init()
