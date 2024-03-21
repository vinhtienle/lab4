const express = require( 'express' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );
const path = require( 'path' );
const sinhvienRoute = require( './routes/sinhvienroutes' );
const SinhVien = require( './models/sinhvienmodel' );
//tao doi tuong express

const app = express();

mongoose.connect( 'mongodb+srv://vinhdvph35610:daovanvinh@cluster0.ztfpwzh.mongodb.net/db1?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlparser: true,
    useUnifiedTopology: true
} ).then( () =>
{
    console.log( 'da ket noi thang cong voi db' );
} ).catch( ( err ) =>
{
    console.error( "loi: " + err );
} )

// su dung bodyparser (lay du lieu tu requise)
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

// su dung route 
app.use( '/sinhvien', sinhvienRoute );
// upload vao thu muc

const uploadsDir = path.join( __dirname, 'uploads' );
app.use( '/uploads', express.static( uploadsDir ) );

// su dung ejs 
app.set( 'views', path.join( __dirname, 'views' ) );

// su li yeu cau den trang chinh

app.get( '/', async ( req, res ) =>
{
    try
    {
        // lay danh sach sinh vien 
        const sinhviens = await SinhVien.find();
        //render
        res.render( 'index', { sinhviens: sinhviens } );
    } catch ( error )
    {
        console.error( error );
        res.status( 500 ).json( { error: error } );
    }
} );

// su ly soa;
app.use( bodyParser.json() );
app.use( ( req, res, next ) =>
{
    if ( req.query._method == 'DELETE' )
    {
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
} );

app.delete( '/sinhvien/:id', async ( req, res ) =>
{
    const id = req.params.id;
    try
    {
        await SinhVien.findByIdAndDelete( id );
    } catch ( error )
    {
        console.error( error )
    }
} );

// khoi dong server 
const PORT = process.env.PORT || 3000;
app.listen( PORT, () =>
{
    console.log( ` server dang chay o cong ${ PORT }` );
} );