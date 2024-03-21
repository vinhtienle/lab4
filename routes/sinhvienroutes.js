const express = require( 'express' );
const routes = express.Router();
const multer = require( 'multer' );
const path = require( 'path' );
const SinhVien = require( '../models/sinhvienmodel' );


const storage = multer.diskStorage( {
    destination: ( req, file, cb ) =>
    {
        cb( null, 'uploads/' );
    },
    filename: ( req, file, cb ) =>
    {
        cb( null, file.fieldname + '-' + Date.now() + path.extname( file.originalname ) );
    }
} );
const upload = multer( { storage: storage } );

//form delete sinh vien 
routes.get( '/from', ( req, res ) =>
{
    res.sendFile( path.join( __dirname ), '../views/form.html' );
} )

// thuc hien them sinh vien 
routes.post( '/', upload.single( 'picture' ),
    async ( req, res ) =>
    {
        try
        {
            const { name } = req.body;
            const picture = req.file ? req.file.fieldname : null;
            const sv = new SinhVien( { name, picture } );
            await sv.save();
            res.redirect( '/' );
        } catch ( err )
        {
            console.error( err )
            res.status( 500 ).json( { error: err } );
        }
    } )
module.exports = routes;