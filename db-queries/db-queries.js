const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:rauliglesias:Fourcade1@localhost:5432/imageboard');


//INSERT IMAGE
module.exports.insertImage = (fileName, userName, imgTitle, imgDescription) => {

    const query = ` INSERT INTO images
                    (image, username, title, description)
                    VALUES ($1, $2, $3, $4)`

    const params = [fileName, userName, imgTitle, imgDescription]

    return db.query(query, params)

            .then(() => {
                return({ success: true })

            })
            .catch(err => res.json({ success: false }));
}

//GET IMAGES
module.exports.getImages = () => {

    const query = ` SELECT  image,
                            id,
                            title,
                            created_at AS date
                    FROM images
                    ORDER BY created_at DESC`

    return db.query(query)
            .then(results => {

                if(results.rowCount < 1) {
                    return({ success: false })
                }

                return({
                    success: true,
                    images: results.rows
                })
            })
            .catch(err => res.json({ success: false }));
}

//SHOW IMAGE
module.exports.showImage = (imageId) => {

    const query = ` SELECT  images.image AS image,
                            images.id AS image_id,
                            images.title AS image_title,
                            images.description AS image_description,
                            images.username AS image_username,
                            comments.comment_text AS comment_text,
                            comments.username AS user_name
                    FROM images FULL JOIN comments
                    ON images.id = comments.image_id
                    WHERE images.id = $1`

    const params = [imageId]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false })
                }

                return({
                    success: true,
                    qResults: results.rows
                    image: results.rows[0]
                })
            })
            .catch(err => res.json({ success: false }));
}

//INSERT COMMENT
module.exports.insertComment = (imageId, commentUser, comment) => {

    const query = ` INSERT INTO comments
                    (image_id, username, comment_text)
                    VALUES ($1, $2, $3)`

    const params = [imageId, commentUser, comment]

    return db.query(query, params)

            .then(() => {
                return({ success: true })
            })

            .catch(err => res.json({ success: false }));
}
