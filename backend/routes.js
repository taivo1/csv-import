const router = require('express').Router(),
      models = require('./models'),
      csv    = require('fast-csv');


const AsyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch(next);
};


/**
 * Displays the UI
 */
router.get('/', (req, res, next) => res.sendFile(__dirname + '/../index.html'));


/**
 * For importing the csv file with data
 */
router.post('/import', AsyncMiddleware(async (req, res, next) => {

    csv.fromStream(req)
        .on('data', function(data){
            console.log(data);
        })
        .on('end', function(){
            console.log("done");
        });

    req.on('end', next);
}));

/**
 * Search users on db
 */
router.post('/search', AsyncMiddleware(async (req, res, next) => {

    res.json([]);
}));



module.exports = router;