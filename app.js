var express = require('express');
var app = express();

var mongodb = require('mongodb');
var createFilter = require('odata-v4-mongodb').createFilter;
var parseSchema = require('mongodb-schema');
const odataMongo = require('@sealsystems/odata-mongo');

//set mongoDb connection information
//colName: name of the collection
//dbName: name of the database
//url: MongoDb connection url, default: 'mongodb://localhost:27017/'
var colName = 'product_data';
var dbName = 'PIM_db';
var url = 'mongodb://localhost:32768/';

//@sealsystems/odata-mongo
//https://github.com/sealsystems/node-odata-mongo
app.get('/data/odata-mongo', odataMongo(), async (req, res) => {
    try{

        let client = await connect_to_db();
        
        console.log(JSON.stringify(req.mongo));

        get_from_db(res, req, client, '/data/odata-mongo', req.mongo.query, req.mongo.queryOptions)

    }catch(e){

        console.log("Error occured: " + e);

    }
});

//OData V4 Service modules - MongoDB Connector
//https://www.npmjs.com/package/odata-v4-mongodb
//this one currently ignores select if combined with $filter
app.get('/data/odata-v4-mongodb', async function(req, res) {
    try{
        let client = await connect_to_db();
        let query = JSON.stringify(req.query);

        console.log("Select: " + req.query.$select + " - Filter: " + req.query.$filter);

        console.log(query);
            
            //$metadata request, get db schema
            if(typeof query === 'undefined'){

                throw new Error('Invalid query');

            }
            else if(query ==='{"$metadata":""}'){

                parse_db_shema(res, client, '/data/odata-v4-mongodb');

            }
            else if (query === "{}"){

                get_from_db(res, req, client, '/data/odata-v4-mongodb', "{}", )

            }
            //if query is valid, get data from db
            else{

                let filter = createFilter(req.query.$filter);
                console.log(filter);
                get_from_db(res, req, client, '/data/odata-v4-mongodb', filter)

            }

    }catch(e){

        console.log("Error occured: " + e);

    }
});


var connect_to_db = async () => {
    try{
        //Establish connection with mongoDB instance
        let MongoClient = mongodb.MongoClient;
        client = await MongoClient.connect(url, { useNewUrlParser: true });

        console.log("Connected to mongodb!");

        return client;
    }
    catch(e){

        res.writeHead(500, {'Content-Type': 'application/json'});
        res.write("Couldn't connect to database!");
        res.end();

        throw new Error("Couldn't connect to database!" + '\n' + e);
    }
}

var get_from_db = async (res, req, client, route, query, query_options) => {

    let db = client.db(dbName);
    let collection = db.collection(colName)

    let tmp;

    //console.log(query, query_options);

    if(query_options)
         tmp = await collection.find(query, query_options).toArray();
    else
        tmp = await collection.find(query).toArray();

    res.json({
        '@odata.context': req.protocol + '://' + req.get('host') + route,
        value: tmp
    });

    client.close();
    console.log("Client closed");

};


var parse_db_shema = async (res, client, route) => {
    
    let db = client.db(dbName);
    let collection = db.collection(colName)

    //here we are passing in a cursor as the first argument. 
    //you can also pass in a stream or an array of documents directly.
    parseSchema(collection.find(), /*{semanticTypes: true, storeValues : false},*/ function(err, schema){
        if (err) return console.error(err);

        res.json({
            '@odata.context': req.protocol + '://' + req.get('host') + route + '$metadata',
            value: schema
        });

        client.close();
        console.log("Client closed");

    }.bind(res, req));
};

var port = process.env.PORT || 8080;
app.listen(port);

module.exports = app;