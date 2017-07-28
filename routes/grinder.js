const express = require('express');
const router = express.Router();
const PythonShell = require('python-shell');

const monk = require('monk')

// Connection URL
const url = 'localhost:27017/grinderDB';

const db = monk(url);

db.then(() => {
  console.log('extractions: Connected correctly to the grinderDB')
})

const collection = db.get('grinder')

router.get('/', function(req, res, next) {
  console.log('Get to grinder');
  collection.findOne().then((results) => {
    res.send(results);
  });
});

/* POST new grinder value for moving. */
router.put('/:id', function(req, res, next) {
  //console.log(req.headers);
  if( req.params.id === 'move' ) {
    console.log("Moving to", req.body.grinder);

    let options = {
      mode: 'text',
      args: []
    };
    options.args = req.body.grinder;
    console.log("amount: " + options.args);
    PythonShell.run('interface.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      //console.log('results: %j', results);
    });
    collection.findOne({}).then( doc => {
      if( doc !== null )
        collection.update({}, { $set: { currentValue: req.body.grinder } });
      else
        collection.insert([{ currentValue: req.body.grinder, }]);
    });
  }else if( req.params.id === 'set') {
    collection.findOne({}).then( doc => {
      console.log(doc);
      if( doc !== null )
        collection.update({}, { $set: { currentValue: req.body.grinder } });
      else
        collection.insert([{ currentValue: req.body.grinder, }]);
      }
    );
  }

  //res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
  res.send("ok");
});

module.exports = router;