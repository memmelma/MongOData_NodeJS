var express = require('express');
var app = express();

var mongodb = require('mongodb');
var createFilter = require('odata-v4-mongodb').createFilter;
var parseSchema = require('mongodb-schema');
const odataMongo = require('@sealsystems/odata-mongo');

//set mongoDb connection information
var colName = 'product_data';
var dbName = 'PIM_db';
var url = 'mongodb://localhost:32768/';

//@sealsystems/odata-mongo
//https://github.com/sealsystems/node-odata-mongo
app.get('/data/odata-mongo', odataMongo(), async (req, res) => {
    let client;
    let MongoClient = mongodb.MongoClient;
    client = await MongoClient.connect(url, { useNewUrlParser: true });
    console.log("Connected to mongodb!");
    
    let db = client.db(dbName);
    db.collection(colName).find(req.mongo.query, req.mongo.queryOptions).toArray((err, docs) => {
        res.json({
            '@odata.context': /*req.protocol + '://' + req.get('host') + */'/api/$metadata',
            value: docs
        });
    });
  });

//OData V4 Service modules - MongoDB Connector
//https://www.npmjs.com/package/odata-v4-mongodb
app.get("/data/odata-v4-mongodb", async function(req, res) {
    try{
        let client;
        try{
            //Establish connection with mongoDB instance
            let MongoClient = mongodb.MongoClient;
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected to mongodb!");
        }
        catch(e){
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.write("Couldn't connect to database!");
            res.end();

            throw new Error("Couldn't connect to database!" + '\n' + e);
        }

        try{
            
            console.log(JSON.stringify(req.query));
            
            //parser
            //var parser = require('odata-v4-parser');
            //console.log(parser.filter(req.query.$filter));
            
            //$metadata request
            if(JSON.stringify(req.query) ==='{"$metadata":""}'){
                parse_db_shema(res, client);
            }

            //Standard query 
            else{
                var query = createFilter(req.query.$filter);

                console.log('Filter$ ' + req.query.$filter);

                if(JSON.stringify(req.query) !== '{}' && typeof query === 'undefined'){
                    throw new Error('Invalid query!' + '\n' + e);
                }

                get_from_db(res, req, client, query)
            }
        }
        catch(e){
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write('Invalid query!');
            res.end();
            
            throw new Error('Invalid query!' + '\n' + e);
        };
    }
    catch(e){
        console.error(e);
    }
});


var get_from_db = async (res, req, client, query) => {

    let db = client.db(dbName);
    let collection = db.collection(colName)

    let tmp = await collection.find(query).toArray();

    res.json({
        '@odata.context': req.protocol + '://' + req.get('host') + '/api',
        value: tmp
    });

    client.close();
    console.log("Client closed");

};


var parse_db_shema = async (res, client) => {
    
    let db = client.db(dbName);
    let collection = db.collection(colName)

    // here we are passing in a cursor as the first argument. You can
    // also pass in a stream or an array of documents directly.
    parseSchema(collection.find(), /*{semanticTypes: true, storeValues : false},*/ function(err, schema){
        if (err) return console.error(err);

        res.json({
            '@odata.context': /*req.protocol + '://' + req.get('host') + */'/api/$metadata',
            value: schema
        });

        client.close();
        console.log("Client closed");

    }.bind(res));
};

var port = process.env.PORT || 8080;
app.listen(port);

module.exports = app;

/*
        var r = yield db.collection('inserts').insertOne({a:1});
        assert.equal(1, r.insertedCount);
        console.log("Inserted first document");

        // Insert multiple documents
        var r = yield db.collection('inserts').insertMany([{a:2}, {a:3}]);
        assert.equal(2, r.insertedCount);
        console.log("Inserted second document");
*/