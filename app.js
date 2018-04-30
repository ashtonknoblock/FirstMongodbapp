const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//connection URL
const url = 'mongodb://localhost:27017';

//database name 
const dbName = 'myproject';

//use connect method to connect to the server
MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    console.log("connected successfully to server");

    const db = client.db(dbName);
    insertDocuments(db, function() {
        indexCollection(db, function() {
            client.close();
        });     
    });
});


//funtion that inserts documents into MONGO...gets called above on the MONGOclient.connect funtion
const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }


  //find specific docs, in this case were finding docs with the key 'a' with a value of 3.
  const findDocuments = function(db, callback) {
      //get the documents collection 
      const collection = db.collection('documents');
      //find some documents 
      collection.find({'a' : 3}).toArray(function(err, docs){
          assert.equal(err,null);
          console.log('found the following records');
          console.log(docs);
          callback(docs)
      });
  };


  const updateDocument = function(db, callback) {
      //get the documents collection 
      const collection = db.collection('documents')
      //update document... where a is 2, set b to 1.
      collection.updateOne({ a : 2 }
        , {$set: { b : 1 }}, function(err, result){
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log('updated the document with the field of a equal to 2');
        });
  };


  const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteOne({ a : 3 }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Removed the document with the field a equal to 3");
      callback(result);
    });    
  };
  

  const indexCollection = function(db, callback) {
    db.collection('documents').createIndex(
      { "a": 1 },
        null,
        function(err, results) {
          console.log(results);
          callback();
      }
    );
  };