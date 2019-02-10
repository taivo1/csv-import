const router     = require('express').Router(),
      fs         = require('fs'),
      models     = require('./models'),
      csv        = require('fast-csv'),
      through2   = require('through2'),
      multer     = require('multer'),
      bodyParser = require('body-parser');


const AsyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch(next);
};

// Define temporary csv file destination
const upload = multer({ dest: 'tmp/csv/' });


// create application/json parser
const jsonParser = bodyParser.json();


/**
 * @param {string} filePath
 * @return {Promise<any>}
 */
function countFileLines(filePath) {
    return new Promise((resolve, reject) => {
        let lineCount = 0;
        fs.createReadStream(filePath)
        .on('data', (buffer) => {
            let idx = -1;
            lineCount--; // Because the loop will run once for idx=-1
            do {
                idx = buffer.indexOf(10, idx + 1);
                lineCount++;
            } while (idx !== -1);
        }).on('end', () => {
            resolve(lineCount);
        }).on('error', reject);
    });
};


/**
 * Displays the UI
 */
router.get('/', (req, res, next) => res.sendFile(__dirname + '/../index.html'));


/**
 * For importing the csv file with data
 */
router.post('/import', upload.single('filepond'), AsyncMiddleware(async (req, res, next) => {

    let processed = 0;
    let progress = 0.5;

    let numLines = await countFileLines(req.file.path);

    let updateProgress = (batchSize) => {
        processed += batchSize;
        let progressUpdate = Number((0.5 + (processed / numLines / 2)).toFixed(3));

        if (progressUpdate > progress) {
            progress = progressUpdate;
            console.log(progress);
            res.write(progress.toFixed(3));
        }
    };

    let csvStream = csv.fromPath(req.file.path, {ignoreEmpty: true, strictColumnHandling: true});

    csvStream.validate(function (data) {
        return data.length > 1;
    });

    csvStream.on('data', () => {
        updateProgress(1);
    });

    csvStream.on('data-invalid', (data) => {
        console.log('invalid csv data: ' + data);
    });

    /**
     * As objects come out of the stream, we want to persist them into a DB store. However,
     * we have a limited number of connections available (and only so many connections that
     * can even be queued). As such, we're going to process the items in batches of 500. This
     * through stream will buffer the items, and then pass-through an array of
     * 500-items when it becomes available.
     */
    let batchingStream = (function batchObjects( source ) {

        let batchSize = 200;
        let batchBuffer = [];

        return source.pipe(
            through2.obj(
                function handleWrite( item, encoding, done ) {

                    let obj = {
                        name:      item[1],
                        age:       item[2],
                        address:   item[3],
                        team:      item[4],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    batchBuffer.push( obj );
                    // If our batch buffer has reached the desired size, push the batched items onto the READ buffer of the transform stream.
                    if ( batchBuffer.length >= batchSize ) {
                        this.push( batchBuffer );
                        // Reset for next batch aggregation.
                        batchBuffer = [];
                    }
                    done();
                },
                function handleFlush( done ) {
                    /**
                     * It's possible that the last few items were not sufficient (in count)
                     * to fill-out an entire batch. As such, if there are any straggling
                     * items, push them out as the last batch.
                     */
                    if ( batchBuffer.length ) {
                        this.push( batchBuffer );
                    }
                    done();
                }
            )
        );

    })( csvStream );

    /**
     * Now that we're pulling batches of items out of the CSV stream, we're going to
     * persist them to a database. However, since db writes are
     * asynchronous, we want to wait until db returns before we move onto the next
     * batch of documents. This way, we don't instantly pull all the csv content into
     * memory and try to spawn an enormous number of connections to DB.
     * @type {void|NodeJS.WritableStream|*}
     */
    let databaseStream = batchingStream.pipe(through2({
            objectMode: true,
            highWaterMark: 2 // Buffer a few batches at a time.
        },
        function handleWrite( batch, encoding, done ) {
            /**
             * Wait until all the DB results come back for this batch of
             * documents before we tell the through stream that we've processed the
             * current read. This should create back-pressure that prevents the
             * feed from aggressively reading data into memory.
             */
            models.sequelize.getQueryInterface().bulkInsert('user', batch).then(
                function handleResolve( results ) {
                    done( null, results );
                },
                function handleError( error ) {
                    done( error );
                }
            );
        })
    );

    /**
     * Since our database stream is still a THROUGH stream, it will buffer results and
     * exert back-pressure. In order to make sure data continues to flow, we need to attach
     * a 'data' handler, to put the through stream into FLOWING mode.
     */
    databaseStream.on('data', function( results ) {
        console.log(results);
    });
    databaseStream.on('end', () => {
        res.write('1.00');
        res.end('ok');
    });
}));

/**
 * Search users on db
 */
router.post('/search', jsonParser, AsyncMiddleware(async (req, res, next) => {

    let keyword = req.body.query || null,
        limit = 20,
        users = [];

    if (!keyword || typeof keyword !== 'string') {
        users = await models.User.findAll({limit: limit});
    } else {
        users = await models.sequelize.query('SELECT * FROM user WHERE name like ? LIMIT ?', {
            replacements: ['%' + keyword + '%', limit],
            type:         models.sequelize.QueryTypes.SELECT,
            model:        models.User,
            mapToModel:   true
        });
    }
    res.json(users.map((user) => user.toJSON()));
}));



module.exports = router;