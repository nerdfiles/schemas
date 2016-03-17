# Schemas

Javascript library and command-line tool to rock Schemas.

### work in progress


## The idea

Schemas are the fundamental building block for a Linked Data web. It would be sad then if developers can't get access to data schemas and get the most out of them, no?

This library simplifying searching and querying different data schemas proving a command-line tool and a library for NodeJS.

## Install
```bash
$ npm install -g schemas
```

## Actual usage as a CLI tool

```
$ schemas search Music
[ { rdfsClass: 'MusicPlaylist',
    rdfsComment: '',
    rdfsSubClassOf: { title: 'CreativeWork', url: 'http://schema.org/CreativeWork' } },
  { rdfsClass: 'MusicAlbum',
    rdfsComment: '',
    rdfsSubClassOf: 
     { title: 'MusicPlaylist',
       url: 'http://schema.org/MusicPlaylist' } },
  ...
]
```

### Screens

#### [urlview][urlview]

![urlview](https://raw.githubusercontent.com/nerdfiles/schemas/master/img/urlview.png)

#### [percol][percol]

![percol](https://raw.githubusercontent.com/nerdfiles/schemas/master/img/percol.png)

![percol-q](https://raw.githubusercontent.com/nerdfiles/schemas/master/img/percol-q.png)

## Ideal usage as a CLI tool
```bash 
$ schemas search T
(schema.org) Text
(schema.org) Time

$ schemas show Identity # See interchangeability in HTML5 semantics: https://schema.org/author

(schema.org) Class > Identity # ids
- additionalType
- alternateName
- description
- image
- mainEntityOfPage
- name
- potentialAction
- sameAs
- url

    data[0]['identities']

(schema.org) Class > Value # dev
- additionalType
- alternateName
- description
- image
- mainEntityOfPage
- name
- potentialAction
- sameAs
- url

    data[0]['values']

(schema.org) Class > Gidouille # guid
- additionalType
- alternateName
- description
- image
- mainEntityOfPage
- name
- potentialAction
- sameAs
- url

    data[0]['guids']

(schema.org) Class > Object # syz
- additionalType
- alternateName
- description
- image
- mainEntityOfPage
- name
- potentialAction
- sameAs
- url

    data[0]['objects']

(schema.org) Class > Assertion # pata http://www.pataphor.com/whatisapataphor.html#ex1
- additionalType
- alternateName
- description
- image
- mainEntityOfPage
- name
- potentialAction
- sameAs
- url

    data[0]['assertions']

(schema.org) Class > Datum # anom
- additionalType
- alternateName
- description
- image
- mainEntityOfPage
- name
- potentialAction
- sameAs
- url

    data[0]['data']

$ schemas add http://www.iana.org/assignments/media-types/application/vnd.api+json
(www.iana.org) NewSchema

$ schemas generate Assertion --mysql
// Helper to generate tables?
```

## Ideal usage as a library

```javascript
var schemas = require('schemas');
var schemaorg = schema('http://schema.rdfs.org/all.json');

var station1 = new schemaorg.TrainStation({
 geo: {longitude:10, latitude:20}
})

var station2 = new schemaorg.TrainStation({
 geo: {longitude:10, latitude:20}
})

var station2 = new schemaorg.TrainTrip({
  departureStation: station1,
  arrivalStation:station2
})
```

## Future goals

    $ cliprogram [WebPage] /with/ [breadcrumb] (and) [AboutPage]

Sentential operations can be expressed in Openchain’s [Alias][0] scheme.

[0]: https://docs.openchain.org/en/latest/ledger-rules/general.html#aliases-aka-name
[urlview]: http://urlview.com
[percol]: http://percol.com
