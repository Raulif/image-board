const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./db-queries/db-queries')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
const toS3 = require('./toS3').toS3;

//---------------------------- MIDDLEWARE ------------------------------------//

//MULTER
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//EXPRESS STATIC
app.use(express.static(`${__dirname}/public`))

//BODY PARSER
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())


//-------------------------------- ROUTES ------------------------------------//


//POST UPLOAD IMAGE
app.post('/upload', uploader.single('imageFile', 'username', 'imgtitle', 'imgdescription'), (req, res) => {
    // If nothing went wrong the file is already in the uploads directory

    if(req.file) {
        toS3(req.file)
        .then(() => {
            //only after this, do the insert query to DB
            let { username, imgtitle, imgdescription } = req.body

            return db.insertImage(req.file.filename, username, imgtitle, imgdescription)

                    .then(results => {

                        res.json({ success: true })
            })
        })
        .catch(err => res.json({ success: false }));

    } else {

        res.json({ success: false })
    }
});


//GET HOME
app.get('/home', (req, res) => {

    const qShowImages = `SELECT image,
                                id,
                                title,
                                created_at AS date
                        FROM images
                        ORDER BY created_at DESC`;

    db.getImages()
        .then(results => {

            if(results.success) {

                return res.json({
                    success: true,
                    images: results.images
                })
            }
        })
        .catch(err => console.log(err));
})


//GET IMAGE - ID
app.get('/images/:id', (req, res) => {

    var imageId = req.params.id

    db.showImage(imageId)

        .then(results => {
            if(results.success){

                res.json({
                    success: true,
                    qResults: results.qResults,
                    image: results.image
                })
            }
        })
        .catch(err => console.log(err));
})

//POST COMMENT
app.post('/post-comment', function(req, res) {
    if(!!req.body.comment && !!req.body.commentuser) {

        let { imageId, commentuser, comment } = req.body

        return db.insertComment(imageId, commentuser, comment)

                .then(results => {
                    if(results.success) {

                        res.json({success: true})
                    }
                })
                .catch(err => res.json({success: false}));
    }

    else {
        console.log('missing username or comment text');
        res.json({success: false})
    }
});

app.listen(8080, () => {console.log('listening on port: 8080')})
