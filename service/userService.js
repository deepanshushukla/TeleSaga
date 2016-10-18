/**
 * Created by anil on 4/7/15.
 */
var _ = require("lodash")
var dao = require("../dao")
var model = require("../model/model")
var scrapManager = require("../scrap/scrapManager")
var appUtil = require("../appUtil/appUtil")

module.exports = {
    find : dao.userDao.find,
    getLikedShows : dao.userDao.getLikedShows,
    getFollowedShows : dao.userDao.getFollowedShows,
    /**
     *
     * @param userId
     * @param like
     * @param showId
     * @param callback
     */
    likeShow : function (userId ,like , showId , callback) {
        if(like){
            var  likedAt =  appUtil.getCurrentTime();
            dao.showDao.likeShow( showId , userId , likedAt, function (done) {
                dao.userDao.likeShow( userId , showId , likedAt , callback)
            })
        }else{
            dao.showDao.unLikeShow(userId , showId )
            dao.userDao.unLikeShow(userId ,showId )
            callback(appUtil.appConstants.SUCCESS_RESPONSE);
        }
    },
    /**
     *
     * @param userId
     * @param follow
     * @param showId
     * @param callback
     */
    followShow : function (userId ,follow , showId , callback) {
        if(follow){
            var  followedAt =  appUtil.getCurrentTime();
            dao.showDao.followShow( showId , userId , followedAt, function (done) {
                dao.userDao.followShow( userId , showId , followedAt , callback)
            })
        }else{
            dao.showDao.unFollowShow(userId , showId )
            dao.userDao.unFollowShow(userId ,showId )
            callback(appUtil.appConstants.SUCCESS_RESPONSE);
        }
    },
    /**
     *
     * @param fbUser
     * @param device
     * @param existingUser
     * @param callback
     * @return {*}
     * @constructor
     */
    CreateUpdateFbUser : function(fbUser, device, existingUser ,callback) {
        var toUpdate = {};
        var imgPath = fbUser.picture.data.url;
        //Check if User Already exists and act accordingly
        if(existingUser){
            if(!existingUser.fbToken){
                toUpdate.fbToken = fbUser.accessToken;
            }
            if(imgPath && existingUser.fbImageUrl && existingUser.fbImageUrl != imgPath){
                toUpdate.fbImageUrl = imgPath;
            }
            if(_.isEmpty(toUpdate)){
                //Nothing to Update
                return callback(existingUser);
            }
        }
        var createUpdateUser = function(imageUrl){
            if(!existingUser){
                var user = new model.db.User({
                    email: fbUser.email, name: fbUser.name, gender : fbUser.gender,
                    displayPic: imageUrl , fbToken : fbUser.accessToken, fbImageUrl : imgPath,
                    fbId : fbUser.id , isActive: true , did : device.did , pt : device.pt,
                    acd : appUtil.getCurrentTime()
                });
                toUpdate = user;
            }else{
                var user = new model.db.User({
                    name: fbUser.name,
                    displayPic: imageUrl , fbToken : fbUser.accessToken, fbImageUrl : imgPath,
                    fbId : fbUser.id , isActive: true , did : device.did , pt : device.pt,gender : fbUser.gender,
                    pos : fbUser.pos
                });
                toUpdate = user;
            }
            var email = toUpdate.email = fbUser.email;
            dao.userDao.CreateUpdateUser(toUpdate, function (done) {
                if(done){
                    dao.userDao.find({email : email } , function(user){
                        callback(user);
                    })
                }else{
                    appUtil.exceptions.getErrorUpdatingUserException();
                }
            });
        }
        //Upload image just in case new user or new image
        if (toUpdate.fbImageUrl || !existingUser ) {
            appUtil.appHttpClient.downloadFileFromUrl(imgPath , function (file) {
                var image = { path : file.path , extension : appUtil.mediaUtil.getMediaExtension(file.path) , name : file.name}
                appUtil.mediaUtil.uploadMedia(image , function(imageUrl){
                    createUpdateUser(imageUrl);
                },[]);
            })
        }else{
            createUpdateUser();
        }
    },
}
