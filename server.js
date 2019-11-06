//setup Express
var express = require('express');
var app = express();

//setup Mongo connection
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useUnifiedTopology: true, useNewUrlParser: true };

//bodyParser
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set the view engine - ejs
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/products', function (req, res) {
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fullstack");
        var query = {};
        dbo.collection("products")
            .find(query)
            .toArray(function (err, result) {
                if (err) throw err;
                console.log("------------------------------------");
                console.log("------------------------------------");
                console.log("------------------------------------");
                res.render('pages/products', { products: result });
                console.log(result);
                db.close();
            });
    });
});

//detail
app.get('/products/detail/:id', function (req, res) {
    var a = req.params.id;
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fullstack");

        var query = { ID: a };
        dbo.collection("products")
            .findOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/productdetail', { products: result });
                db.close();
            });
    });
});

//edit
app.get('/products/edit/:id', function (req, res) {
    var a = req.params.id;
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fullstack");
        var query = { ID: a }
        dbo.collection("products")
            .findOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/productedit', { products: result });
                db.close();
            });
    });
});

app.post("/Save", function (req, res) {
    var p_ID = req.body.ID;
    var p_Brand = req.body.Brand;
    var p_Ram = req.body.Ram;
    var p_price = req.body.price;
    var p_create_at = req.body.create_at;
   
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fullstack");
        /////////Select target///////////////
        var query = { ID: p_ID};
        /////////Set value///////////////////
        var newvalues = {
            $set: {
                ID: p_ID,
                Brand: p_Brand,
                Ram: p_Ram,
                price: p_price,
                create_at: p_create_at,
            }
        };
        dbo.collection("products")
            .updateOne(query, newvalues, function (err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " document(s) updated");
                db.close();
            });
    });
    res.redirect("/products");
});


//delete
app.get('/products/delete/:id', function (req, res) {
    var a = req.params.id;
    MongoClient.connect(url,options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fullstack");
        var myquery = { ID: a };
        dbo.collection("products").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("Delete success! ");
            res.redirect("/products");
            db.close();
        });
    });
});



//add

app.get('/productadd', function (req, res) {
    res.render('pages/productadd');
});

app.post('/Add', function (req, res) {
    var p_ID = req.body.ID;
    var p_Brand = req.body.Brand;
    var p_Ram = req.body.Ram;
    var p_price = req.body.price;
    var p_create_at = req.body.create_at;

    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("fullstack");

        /////////Set value///////////////////
        var newvalues = {
                ID: p_ID,
                Brand: p_Brand,
                Ram: p_Ram,
                price: p_price,
                create_at: p_create_at,          
        };
        dbo.collection("products")
          .insertOne(newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
    });
    res.redirect("/products");
});



app.listen(5000);
console.log('Express start at "http://localhost:5000" ');