const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:rauliglesias:Fourcade1@localhost:5432/imageboard');
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
var toS3 = require('./toS3').toS3;


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

app.use(express.static(`${__dirname}/public`))
// app.use(express.static(`${__dirname}/uploads`))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())



app.post('/upload', uploader.single('imageFile', 'username', 'imgtitle', 'imgdescription'), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory

    if(req.file) {
        toS3(req.file)
        .then(function(){
            //only after this, do the insert query to DB
            const qInsertImage = `INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)`

            const params = [req.file.filename, req.body.username, req.body.imgtitle, req.body.imgdescription]

            return db.query(qInsertImage, params).then(()=> {
                res.json({success: true})
            })
        })
        .catch(err => res.json({success: false}));
    } else {
        res.json({success: false})
    }
});

app.get('/home', (req, res) => {
    const qShowImages = `SELECT image, id, title FROM images`;
    db.query(qShowImages).then((results) => {
        var images = results.rows;
        res.json({
            images: images,
        })
    }).catch(err => console.log(err));
})

app.get('/images/:id', (req, res) => {

    var id = req.params.id
    console.log(id);
    // var imageid = req.params.imageid
    const qShowImage = `SELECT image, id FROM images WHERE id = $1`;
    db.query(qShowImage, [id]).then((results) => {
        console.log(results.rows[0]);
        var image = results.rows[0]
        res.json({
            image: image
        })
    }).catch(err => console.log(err));
})


app.post('/newcomment', uploader.single('comment'), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory

    if(req.file) {
        toS3(req.file)
        .then(function(){
            //only after this, do the insert query to DB
            const qInsertImage = `INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)`

            const params = [req.file.filename, req.body.username, req.body.imgtitle, req.body.imgdescription]

            return db.query(qInsertImage, params).then(()=> {
                res.json({success: true})
            })
        })
        .catch(err => res.json({success: false}));
    } else {
        res.json({success: false})
    }
});

app.listen(8080, () => {console.log('listening')})
