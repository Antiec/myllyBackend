const express = require("express");
const router = express.Router();
const PythonShell = require("python-shell");

const monk = require("monk");

// Connection URL
const url = "grinderUser:grinderPwd9@localhost:27017/grinderDB";

const db = monk(url, { authSource: "admin" });

db.then(() => {
  console.log("extractions: Connected correctly to the grinderDB");
});

const collection = db.get("grinder");

router.get("/", function(req, res, next) {
  console.log("Get to grinder");
  collection.findOne().then(results => {
    res.send(results);
  });
});

/* PUT new grinder value for moving. */
router.put("/:type", function(req, res, next) {
  console.log(`Put to grinder with type ${req.params.type}`);
  let hadAnError = false;
  if (req.params.type === "move") {
    console.log("Moving to", req.body.grinder);

    let options = {
      mode: "text",
      args: []
    };
    options.args = req.body.grinder;
    console.log("amount: " + options.args);

    PythonShell.run("interface.py", options, function(err, results) {
      if (err) {
        throw err;
      }
      // results is an array consisting of messages collected during execution
      //console.log('results: %j', results);
    }).then(() => {
      collection.findOne({}).then(doc => {
        if (doc !== null)
          collection.update({}, { $set: { currentValue: req.body.grinder } });
        else collection.insert([{ currentValue: req.body.grinder }]);
      });
      console.log("Error: " + hadAnError);
    });
  } else if (req.params.type === "set") {
    collection.findOne({}).then(doc => {
      console.log(doc);
      if (doc !== null)
        collection.update({}, { $set: { currentValue: req.body.grinder } });
      else collection.insert([{ currentValue: req.body.grinder }]);
    });
  }
  res.send("ok");
  //res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
});

module.exports = router;
