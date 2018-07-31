# MongOData_NodeJS

Disclaimer: This repository is part of a university project paper with the title ```Feasibility of an OData Interface on a NoSQL database using the example of a MongoDB```. If interested, you can contact me and I will provide you with the complete documentation of my research.

Also checkout the other respository linked to the research: https://github.com/memmelma/MongOData_Csharp


## Setup
Clone this repo and cd into the directory:

```
git clone https://github.com/memmelma/MongOData_NodeJS.git
cd C:\Users\toastuser\Desktop\MongOData_NodeJS
```

## Running
You can run the endpoint by launching it via 
```
node app.js
```
After that, the data can be accessed via ```localhost:8080/data/[api identifier] ```.

## Version 1 - @sealsystems/odata-mongo
This variant uses the following module: https://github.com/sealsystems/node-odata-mongo

Can be accessed by using  ``` odata-mongo ``` as api identifier.


## Version 2 - OData V4 Service modules - MongoDB Connector
This variant uses the following module: https://www.npmjs.com/package/odata-v4-mongodb

Can be accessed by using 
``` odata-v4-mongodb ``` as api identifier.


On this identifier the ```$metadata``` operator is also available. This is accomplished by using the module 
``` mongodb-schema ``` which can be found under the following link https://github.com/mongodb-js/mongodb-schema .


The module provides an option to show the schema for a mongoDb collection. As mongoDb is a NoSql database with a non relational schema, the syntax and visualization is different to one provided by e.g. a ASP.NET OData endpoint und this operator.


## Conclusion
Both variants provide the basic OData functionality, but fail when it comes to combining multiple operations. E.g. applying multiple "filters" at once works for both, but adding a "select" operation is ignored by version 2. Attempts to update the functionality are made in the repository Wikis, but there currently are no signs to prove these.
