/**
 * Created by anil on 4/7/15.
 */

var model = require("../model/model");
var baseDao = require("./baseDao");
var _ = require("lodash");
var appUtil = require("../appUtil/appUtil");
var commonFields = { name : true, email : true, _id : true};
ObjectID = require('mongodb').ObjectID;
var basicOperations = new baseDao.basicOperations('user');
var appConstants = appUtil.appConstants;

var userColl = baseDao.getColl("user");

userColl.ensureIndex(  { email : 1 }, { unique: true ,sparse: true}, function(err, res){
    console.log("ensuring index for email on user collection .","err",err,"res",res);
});

module.exports = {

    /**
     *
     * @param json : {email , phone , name , id}
     * @param callback
     */
    find : function(json , callback , fields){
        var fieldsToFetch = commonFields;
        if(fields){
            fieldsToFetch = fields
        }
        var query = {};
        if(json.email){
            query.email = json.email;
        }else if(json.id){
            query._id =baseDao.getId(json.id)
        }else if(json.name){
            query.name = json.name;
        }else{
            //throw error
            callback();
        }
        userColl.findOne(query , fieldsToFetch ,baseDao._callback(callback));
    },
    /**
     *
     * @param _id
     * @param callback
     * @param fields
     */
    findById : function(_id, callback , fields){
        var fieldsToFetch = commonFields;
        if(fields){
            fieldsToFetch = fields
        }
        basicOperations.find(baseDao.getId(_id), callback , fieldsToFetch);
    },
    /**
     * @returns LoggedIn Sessions of Current User
     * @param userId
     * @param callback
     */
    getUserSessions : function( userId , callback){
        basicOperations.find( baseDao.getId(userId), callback , {_id : 0 , sessions : 1});
    },
    /**
     * @adds given Session Id to User sessions
     * @param userId
     * @param sessionId
     * @param callback
     */
    addUserSessions : function( userId ,  sessionId , IsDeviceUnset, callback){
        var sessionArray = [sessionId];
        var update = {};
        update.$set = { sessions: sessionArray };
        if(IsDeviceUnset){
            update.$unset = { did : "" , pt : "" };
        }
        userColl.update( {_id : baseDao.getId(userId)}, update , baseDao._callback(callback)  );
    },
    /**
     *
     * @param userId
     * @param userData : { name , image }
     * @param callback
     */
    updateUser : function(userId , userData , callback){
        var toSet = {};
        if(userData.name){
            toSet.name = userData.name;
        }
        if(userData.email){
            toSet.email = userData.email;
        }
        if(userData.displayPic){
            toSet.displayPic = userData.displayPic;
        }
        userColl.update({_id : baseDao.getId(userId)} , {$set :  toSet } , baseDao._callback(callback));
    },
    /**
     *
     * @param userData :  { name , image , timezone}
     * @param callback
     */
    addUser : function (userData, callback) {
        basicOperations.insert(userData , baseDao._callback(callback));
    },
    CreateUpdateUser: function ( user, callback) {
        var toUpdate = {};
        toUpdate["$set"] = user;
        userColl.update({email: user.email},toUpdate,{upsert: true}, baseDao._callback(callback));
    },

    //Like/Unlike Shows Methods
    likeShow : function (userId , showId , likedAt , callback) {
        var likeData =  { showId : showId , likedAt : likedAt }
        userColl.update(
            { _id : baseDao.getId(userId) , "showLikes.showId" : { $ne : showId}} ,
            {$push  : { showLikes : likeData } , $inc : { showLikeCount : 1}} ,
            baseDao._callback(callback))
    },
    UnlikeShow : function (userId , showId , callback) {
        userColl.update(
            { _id : baseDao.getId(userId) , "showLikes.showId" : { $eq : showId}} ,
            {$pull  : { showLikes : { showId : showId }} , $inc : { showLikeCount : -1}} ,
            baseDao._callback(callback))
    },
    //return array of liked Shows
    getLikedShows : function (userId , callback) {
        var processCallback = function (user) {
            if(user){
                if(user.showLikes && !appUtil.isArrayNullOrBlank(user.showLikes)){
                    var showDao = require("./showDao")
                    showDao.getShowsByIdArray(_.map(_.pluck(user.showLikes , "showId"),parseInt) , callback);
                }else{
                    //No Liked Shows
                    callback([]);
                }
            }else{
                //No Such User Exists
                callback();
            }
        }
        userColl.findOne(
            { _id : baseDao.getId(userId)},
            { showLikes : 1} ,
            baseDao._callback(processCallback)
        )
    },

    //Follow/Unfollow Shows Methods
    followShow : function (userId , showId , followedAt , callback) {
        var followData =  { showId : showId , followedAt : followedAt }
        userColl.update(
            { _id : baseDao.getId(userId) , "followedShows.showId" : { $ne : showId}} ,
            {$push  : { followedShows : followData } , $inc : { showFollowCount : 1}} ,
            baseDao._callback(callback))
    },
    unFollowShow : function (userId , showId , callback) {
        userColl.update(
            { _id : baseDao.getId(userId) , "followedShows.showId" : { $eq : showId}} ,
            {$pull  : { followedShows : { showId : showId }} , $inc : { showFollowCount : -1}} ,
            baseDao._callback(callback))
    },
    //return array of Followed Shows
    getFollowedShows : function (userId , callback) {
        var processCallback = function (user) {
            if(user){
                if(user.followedShows && !appUtil.isArrayNullOrBlank(user.followedShows)){
                    var showDao = require("./showDao")
                    showDao.getShowsByIdArray(_.map(_.pluck(user.followedShows , "showId"),parseInt) , callback);
                }else{
                    //No Followed Shows
                    callback([]);
                }
            }else{
                //No Such User Exists
                callback();
            }
        }
        userColl.findOne(
            { _id : baseDao.getId(userId)},
            { followedShows : 1} ,
            baseDao._callback(processCallback)
        )
    },

};

