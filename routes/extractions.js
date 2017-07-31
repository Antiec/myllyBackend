const express = require('express');
const router = express.Router();

const monk = require('monk')

// Connection URL
const url = 'localhost:27017/extractionsDB';

const db = monk(url);

db.then(() => {
  console.log('extractions: Connected correctly to the extractionsDB')
})

const collection = db.get('extractions')


/* POST new extraction. */
router.post('/', function(req, res, next) {
  //console.log(req.headers);
  console.log(req.body.coffee, req.body.grinder, req.body.extractionTime);
  collection.insert([{
    coffee: req.body.coffee,
    roastDate: req.body.roastDate,
    extractionDate: req.body.extractionDate,
    grinder: req.body.grinder,
    dose: req.body.dose,
    extractionTime: req.body.extractionTime,
    weight: req.body.weight,
    grade: req.body.grade,
    notes: req.body.notes},
  ])
    .then((docs) => {
    // docs contains the documents inserted with added **_id** fields
    // Inserted 3 documents into the document collection
  }).catch((err) => {
    // An error happened while inserting
  }).then(() => db.close())

  //res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
  res.send("ok");
});

router.get('/', function(req, res, next) {
  console.log('Get to extractions');
  collection.find().then((results) => {
    res.send(results);
  });
});

module.exports = router;