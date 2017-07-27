const express = require('express');
const router = express.Router();


/* POST new grinder value for moving. */
router.post('/:id', function(req, res, next) {
  //console.log(req.headers);
  if( req.params.id === 'move' )
    console.log("Moving to", req.body.grinder);
  else if( req.params.id === 'set')
    console.log("Setting to", req.body.grinder);

  //res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
  res.send("ok");
});

module.exports = router;