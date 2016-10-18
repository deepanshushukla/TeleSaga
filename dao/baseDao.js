/**
 * Created by anil on 4/7/15.
 */
var ObjectID = require('mongodb').ObjectID;
var dbFactory = require("./daoConfig");
var model = require('../model/model');
var domain = require('domain');
var exceptions = require("../appUtil").exceptions;


var _callback = function(callback , doNotThrowError){
    if(domain.active && domain.active.members.length){
        domain.active.members[0].dbCalls++
    }
    if(!callback){
        callback = function(){}
    }

    return function(err, res){
        if(doNotThrowError){
            if(err){
                console.log(err.errmsg)
                callback(err);
            }else{
                callback(res);
                }
        }else{
            if(err){
                throw exceptions.getDBException(err);
                callback(err , true);
            }else{
                callback(res);
            }
        }
    }
};

var basicOperations = function(collname){
    this.insert = function (json, callback , doNotThrowError){
        getColl(collname).insert(json, _callback(callback , doNotThrowError));
    };
    this.remove = function (_id, callback){
        getColl(collname).remove({_id: getId(_id)}, _callback(callback));
    };
    this.update = function (_id, json, callback){
        getColl(collname).update({_id:getId(_id)}, json, _callback(callback))
    };
    this.find = function (_id, callback , queryParams){
        if(!queryParams){ queryParams = {} }
        getColl(collname).findOne({_id: getId(_id)} , queryParams , _callback(callback));
    }
};

function getColl(name){
    return dbFactory.getDB().collection(name);
}

var getId = function(_id){
    if(_id._bsontype && _id._bsontype==='ObjectID'){
        return _id;
    }else{
        return new ObjectID(_id);
    }
};

function _convertToIdArray(collection){
    var collectionIds = [];
    for(var index in collection){
        collectionIds.push(collection[index]._id);
    }
    return collectionIds;
}
exports.getColl = getColl;
exports.basicOperations = basicOperations;
exports._callback = _callback;
exports.getId = getId;
exports.convertToIdArray = _convertToIdArray;