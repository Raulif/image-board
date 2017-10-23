const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:rauliglesias:Fourcade1@localhost:5432/imageboard');

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.get('/home', (req, res) => {
    var queryImages = `SELECT image FROM images`;
    db.query(queryImages).then((results) => {
        var images = results.rows;
        var jsonFile = require(__dirname + '/config.json')
        var urlString = jsonFile.s3Url
        console.log(urlString);
        res.json({
            images: images,
        })
    }).catch(err => console.log(err));
})


// function setUserName(req, res) {
//
// }
//
// app.put('/user', setUserName)
// app.post('/user', setUserName)


app.listen(8080, () => {console.log('listening')})
