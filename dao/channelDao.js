/**
 * Created by anil on 4/7/15.
 */
/**
 * Created by anil on 4/7/15.
 */

var model = require("../model/model");
var baseDao = require("./baseDao");
var Promise = require("bluebird");
var _ = require("lodash");
var appUtil = require("../appUtil/appUtil");
var commonFields = { name : true, logo : true, genre : true, _id : true , channelId : true};
var basicOperations = new baseDao.basicOperations('channel');
var appConstants = appUtil.appConstants;

var channelColl = baseDao.getColl("channel");

channelColl.ensureIndex(  { name : 1 }, { unique: true ,sparse: true}, function(err, res){
    console.log("ensuring index for channel name on channel collection .","err",err,"res",res);
});

module.exports  = {

    /**
     *
     * @param channel : { logo , name , genre}
     * @param callback
     */
    addChannel : function(channel , callback){
        channelColl.insert(channel , baseDao._callback(callback, true))
    },
    addChannelBulk : function(channels , callback){
        console.log("Adding "+channels.length+" channels")
        channelColl.drop();
        var bulk = channelColl.initializeUnorderedBulkOp();
        _.each( channels , function (channel) {
            bulk.insert(channel)
        })
        bulk.execute(function (err,BulkWriteResult) {
            callback(null , BulkWriteResult);
        });

    },
    findChannelById : function(id , callback){
      channelColl.findOne({_Id : baseDao.getId(id)} , baseDao._callback(callback))
    },
    findChannelByName : function(name , callback){
        channelColl.findOne({name : name} , baseDao._callback(callback))
    },
    findChannelWithNoCategory : function (callback) {
        channelColl.find({ categoryId : null } ,{ _id : false , category : true} ).toArray(baseDao._callback(callback))
    },
    updateChannelCategory : function (chCat) {
        channelColl.update({ category : chCat.name } ,{ $set : { categoryId : chCat.categoryId } },{multi : true }, baseDao._callback(function(){}))
    },
    getNChannels : function(filters , callback){
        var query  = _getQueryFromFilters(filters);
        channelColl.find( query , commonFields).skip(filters.skip).limit(filters.limit).toArray(baseDao._callback(callback))
    },
    getChannelList : function(fields , callback){
        var promise = new Promise( function( resolve , reject){
            var fieldsToFetch = commonFields;
            if(fields){
                fieldsToFetch = fields;
            }
            channelColl.find({} , fields).toArray(baseDao._callback(resolve))
        })
        return promise;
    },

    findChannels : function(filters , callback){
        var query = _getChannelQueryFromFilters(filters);
        channelColl.aggregate(
            {$match : query},
            {$skip : filters.skip},
            {$limit : filters.count},
            baseDao._callback(callback)
        )
    }
}

function _getQueryFromFilters(filters){
    var query = {};
    if(filters.genre){
        query.genre = filters.genre;
    }
    if(filters.name){
    query.searchName = new RegExp(name);
    }

}


function _getChannelQueryFromFilters(filters){
    var query = {};
    query.channelId = filters.channelId;
    query.categoryId = filters.categoryId == 123 ? null : filters.categoryId;
    if(filters.term)
        query.searchName = new RegExp(filters.term);
    query = appUtil.removeNullKeys(query);
    return query;

}