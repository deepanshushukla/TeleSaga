/**
 * Created by anil on 4/7/15.
 */

var app = require("../app")
var social = require("../social")
var service = require("../service")
var appUtil = require("../appUtil/appUtil")

var loginWithFb = {};
loginWithFb.nickname = "loginWithFb";
loginWithFb.path = "/me/login/fb";
loginWithFb.method = "POST";
loginWithFb.params = [
    { name : "accessToken" , type : "string" , required : true , desc : "Facebook Access Token"},
    { name : "did" , type : "string" , required : true , desc : "Device Id"},
    { name : "pt" , type : "string" , required : true , desc : "1 for Android   "}
];
loginWithFb.paramType = "form";
loginWithFb.desc = "Login With Facebook";
app.post(loginWithFb.path , function( req , res){
    //Login With Facebook with this API
    var accessToken = req.body.accessToken;
    var did = req.body.did;
    var pt = req.body.pt;
    var device = {id: did, pt: pt};
    social.getFBProfile(accessToken , function(fbUser) {
        service.userService.find({email : fbUser.email}, function(existingUser) {
            fbUser.accessToken = accessToken;
            service.userService.CreateUpdateFbUser(fbUser, device, existingUser , function(user) {
                appUtil.sessionUtil.loginUserIntoSession(req.session, user);
                app.sendSuccess(res, user);
            });
        });
    });
});

var likedShows = {}
likedShows.nickname = "followShow"
likedShows.path = "/me/liked/shows";
likedShows.method = "GET";
app.get(likedShows.path , function (req, res) {
    var user = appUtil.sessionUtil.getLoggedInUserDetail(req.session , true);
    service.userService.getLikedShows( user._id , function(shows){
        app.sendSuccess(res , shows)
    })
});

var followedShows = {}
followedShows.nickname = "followShow"
followedShows.path = "/me/followed/shows";
followedShows.method = "GET";
app.get(followedShows.path , function (req, res) {
    var user = appUtil.sessionUtil.getLoggedInUserDetail(req.session , true);
    service.userService.getFollowedShows( user._id , function(shows){
        app.sendSuccess(res , shows)
    })
});


var likeShow = {}
likeShow.nickname = "likeShow"
likeShow.path = "/me/like/show/:showId/:like";
likeShow.params = [
    { name : "showId" , type : "string" , required : true , paramType : "path", desc : "Show Id"},
    {name : "like" , type : "number" , required : true , paramType : "path", desc : "Is Like"}
];
likeShow.method = "GET";
likeShow.paramType = "path";
app.get(likeShow.path , function (req, res) {
    var user = appUtil.sessionUtil.getLoggedInUserDetail(req.session , true);
    var showId = parseInt(req.params.showId);
    var like = appUtil.parseBoolean(req.params.like);
    service.userService.likeShow( user._id , like , showId , function(done){
        app.sendSuccess(res , 1)
    })
});

var followShow = {}
followShow.nickname = "followShow"
followShow.path = "/me/follow/show/:showId/:follow";
followShow.params = [
    { name : "showId" , type : "string" , required : true , paramType : "path", desc : "Show Id"},
    {name : "follow" , type : "number" , required : true , paramType : "path", desc : "Is Follow"}
];
followShow.method = "GET";
followShow.paramType = "path";
app.get(followShow.path , function (req, res) {
    var user = appUtil.sessionUtil.getLoggedInUserDetail(req.session , true);
    var showId = parseInt(req.params.showId);
    var follow = appUtil.parseBoolean(req.params.follow);
    service.userService.followShow( user._id , follow , showId , function(done){
        app.sendSuccess(res , 1)
    })
});


module.exports = {
    apis : [followedShows , likedShows , loginWithFb , followShow , likeShow]
}
