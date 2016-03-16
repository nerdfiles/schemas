# Schemas

Javascript library and command-line tool to rock Schemas

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

## Ideal usage as a CLI tool
```bash 
$ schemas search T
(schema.org) Text
(schema.org) Time

$ schemas show Book
(schema.org) Thing > CreativeWork > Book
- bookEdition
- bookFormat
- illustrator
- isbn
- numberOfPages

$ schemas add http://amazingwebsite.com/newschema
(amazingwebsite.com) NewSchema

$ schemas generate Book --mysql
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
