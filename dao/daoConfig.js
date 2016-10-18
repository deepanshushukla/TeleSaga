/**
 * Created by anil on 4/7/15.
 */

var MongoClient = require('mongodb').MongoClient;
var appConstants = require("../appUtil/appConstants");
var db;

module.exports = {

    getDB : function(){
        return db;
    },

    init : function(dbName , callback){
        if(db){
            callback();
            return;
        }
        // Initialize connection once
        MongoClient.connect("mongodb://localhost:27017/"+dbName, function(err, database) {
            //database.authenticate(appConstants.DB_CONSTANTS.DB_USER, appConstants.DB_CONSTANTS.DB_PASS, function (err, result) {
                if (err) throw err;
                db = database;
                console.log("connected to db " + dbName);
                callback(database);
            //});
        })
    }
}
