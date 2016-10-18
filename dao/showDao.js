/**
 * Created by anil on 4/7/15.
 */

var model = require("../model/model");
var baseDao = require("./baseDao");
var _ = require("lodash");
var Promise = require("bluebird");
var appUtil = require("../appUtil/appUtil");
var commonFields = { name : true, image : true, link : true,time : true, channelId :true ,showId : true, _id : true};
var basicOperations = new baseDao.basicOperations('show');
var appConstants = appUtil.appConstants;

var showColl = baseDao.getColl("show");
var commentColl = baseDao.getColl("comment");
var ssColl = baseDao.getColl("showSchedule");

showColl.ensureIndex(  { showId : 1 }, { unique: true ,sparse: true}, function(err, res){
    console.log("ensuring index for show id on show collection .","err",err,"res",res);
});

module.exports  = {

    addView : function ( showid , callback) {
        showColl.update( { showId : parseInt(showid) }, { $inc : { viewCount : 1 }}, baseDao._callback(callback));
    },
    /**
     *
     * @param show : { logo , name , genre , timing , channel , date}
     * @param callback
     */
    addShow : function(show , callback){
        var callback1 = function(inserted){ }
        showColl.insert(show , baseDao._callback(callback1,true))
    },
    addSchedule : function(show , callback){
        ssColl.insert(show , baseDao._callback(callback,true))
    },
    addShowBulk : function(shows , callback){
        if(_.isEmpty(shows)){
            return;
        }
        console.log("Adding "+shows.length+" Shows")
        var bulk = showColl.initializeUnorderedBulkOp();
        _.each( shows , function (show) {
            bulk.insert(show)
        })
        bulk.execute(function (err,BulkWriteResult) {});
    },
    addScheduleBulk : function(shows , callback){
        if(_.isEmpty(shows)){
            return;
        }
        console.log("Adding "+shows.length+" Schedules")
        var bulk = ssColl.initializeUnorderedBulkOp();
        _.each( shows , function (show) {
            bulk.insert(show)
        })
        bulk.execute(function (err,BulkWriteResult) {});
    },
    postComment : function (comment , callback) {
        commentColl.insert( comment , callback );
    },
    addComment : function ( showId , commentId , callback) {
      showColl.update( { showId : showId} , { $addToSet : { comments : commentId }} , baseDao._callback(callback))
    },
    findShowById : function(id , callback){
        showColl.findOne({_Id : baseDao.getId(id)} , baseDao._callback(callback))
    },
    findShowByName : function(name , callback){
        showColl.findOne({name : name} , baseDao._callback(callback))
    },
    findShows : function(filters , callback){
        var query = _getShowQueryFromFilters(filters);
        showColl.aggregate(
            {$match : query},
            {$skip : filters.skip},
            {$limit : filters.count},
            baseDao._callback(callback)
        )
    },
    getShowsByChannel : function(channelId , date , callback){
        var query = { channelId : channelId};
        query.schedule = {$elemMatch : {date : { $and : [{$lt : date},{$gt : date-appConstants.TIME_UNIT.ONE_DAY}]}}}
        showColl.find( query , commonFields).toArray(baseDao._callback(callback))
    },
    findShowsByChannel : function(filters , callback){
        var query = _getScheduleQueryFromFilters(filters)
        ssColl.aggregate(
            {$match : query},
            {$sort :  { fullDateWithTime : 1} },
            baseDao._callback(callback)
        )
    },

    findSchedule : function (filters , callback) {
        var query = _getScheduleQueryFromFilters(filters);
        ssColl.aggregate(
            {$match : query},
            {$skip : filters.skip},
            {$limit : filters.count},
            {$sort : { fullDateWithTime : 1 } },
            baseDao._callback(callback)
        )
    },
    getShowList : function(fields , callback){
        var promise = new Promise( function( resolve , reject){
            var fieldsToFetch = commonFields;
            if(fields){
                fieldsToFetch = fields;
            }
            showColl.find({ isNewImage : { $exists : false }} , fieldsToFetch).toArray(baseDao._callback(resolve))
        })
        return promise;
    },
    getComments : function (showid , callback) {
        commentColl.find({ showId : showid }).toArray(baseDao._callback(callback));
    },
    updateImage : function(showId , showImage , callback){
        if(appUtil.isNullOrBlank(showImage) ){
            return;
        }
        console.log("Updating Show Image "+ showId+"..."+showImage )
        showColl.update({ showId : showId} , { $set : { image : showImage , isNewImage : true } } ,{ multi : true }, baseDao._callback(callback))
        ssColl.update({ showId : showId} , { $set : { image : showImage ,isNewImage : true } } ,{ multi : true }, baseDao._callback(callback))
    },

    //Like/Unlike Methods
    likeShow : function (showId , userId , likedAt , callback) {
        var likeData = { userId : userId , likedAt : likedAt }
        showColl.update(
            { showId : showId , "likes.userId" : { $ne : userId} } ,
            {$push  : { likes : likeData} , $inc : { likeCount : 1}} ,
            baseDao._callback(callback))
    },
    unLikeShow : function (userId , showId , callback) {
        showColl.update(
            { showId : showId ,"likes.userId" : userId } ,
            {$pull  : { likes : { userId : userId}} , $inc : { likeCount : -1}} ,
            baseDao._callback(callback))
    },

    getMostLikedShows : function (callback) {
        showColl.find({ likeCount : { $ne : 0 }}).sort({ likeCount : -1}).limit(appConstants.MAX_RESULTS).toArray(baseDao._callback(callback));
    },
    getMostViewedShows : function (callback) {
        showColl.find({ viewCount : { $ne : 0 }}).sort({ viewCount : -1}).limit(appConstants.MAX_RESULTS).toArray(baseDao._callback(callback));
    },

    //Follow/UnFollow Methods
    followShow : function (showId , userId , followedAt , callback) {
        var followData = { userId : userId , followedAt : followedAt }
        showColl.update(
            { showId : showId , "followers.userId" : { $ne : userId} } ,
            {$push  : { followers : followData} , $inc : { followCount : 1}} ,
            baseDao._callback(callback))
    },
    unFollowShow : function (userId , showId , callback) {
        showColl.update(
            { showId : showId ,"followers.userId" : userId } ,
            {$pull  : { followers : { userId : userId}} , $inc : { followCount : -1}} ,
            baseDao._callback(callback))
    },
    getShowsByIdArray : function( showIds , callback){
        showColl.find({showId : { $in : showIds }}).toArray(baseDao._callback(callback));
    }
}



function _getScheduleQueryFromFilters(filters){
    var query = {};
    query.channelId = filters.channelId;
    query.showId = filters.showId;
    query.date = filters.date;
    query.minRat = filters.minRat;
    query.maxRat = filters.maxRat;
    if(filters.term)
        query.searchName = new RegExp(filters.term);
    if(filters.fromDate && filters.toDate){
        query.fullDateWithTime = { $lte : filters.toDate , $gte : filters.fromDate}
    }else if(filters.fromDate){
        query.fullDateWithTime = { $gte : filters.fromDate}
    }else if(filters.toDate){
        query.fullDateWithTime = { $lte : filters.toDate}
    }
    appUtil.removeNullKeys(query);
    console.log(JSON.stringify(query))
    return query;

}



function _getShowQueryFromFilters(filters){
    var query = {};
    query.channelId = filters.channelId;
    query.categoryId = filters.categoryId;
    if(filters.term)
        query.searchName = new RegExp(filters.term);
    query = appUtil.removeNullKeys(query);
    return query;

}