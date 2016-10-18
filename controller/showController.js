/**
 * Created by anil on 4/7/15.
 */

var app = require("../app")
var service = require("../service")
var d3 = require("d3")
var _ = require("lodash")
var helper = require("./controllerHelper/showControllerHelper")
var appUtil = require("../appUtil/appUtil")



var findShows = {}
findShows.nickname = "findShows"
findShows.path = "/shows/find"
findShows.method = "POST"
findShows.paramType = "form"
findShows.params = [
    { name : "skip" , type : "number" , required : true , desc : "skip this count"},
    { name : "count" , type : "number" , required : true , desc : "return this number of results"},
    { name : "categoryId" , type : "string" , required : false , desc : "Category Id"},
    { name : "channelId" , type : "string" , required : false , desc : "Channel Id"},
    { name : "showId" , type : "string" , required : false , desc : "Show Id"},
    { name : "rating" , type : "number" , required : false , desc : "minimum rating"},
    { name : "term" , type : "string" , required : false , desc : "Search Term"}
]
app.post(findShows.path , function(req , res){
    var filters = _getFilters(req);
    service.showService.findShows( filters , function(done){
        app.sendSuccess(res , done)
    })
});


var whatshot = {}
whatshot.nickname = "whatshot"
whatshot.path = "/shows/hot";
whatshot.method = "GET";
app.get(whatshot.path , function (req, res) {
    service.showService.getMostLikedShows(function(shows){
        app.sendSuccess(res , shows)
    })
});

var mostviewed = {}
mostviewed.nickname = "mostviewed"
mostviewed.path = "/shows/viewed/most";
mostviewed.method = "GET";
app.get(mostviewed.path , function (req, res) {
    service.showService.getMostViewedShows(function(shows){
        app.sendSuccess(res , shows)
    })
});

var addView = {}
addView.nickname = "addView"
addView.path = "/shows/:showId/is/viewed";
addView.method = "GET";
addView.summary = "This API used for updating show view count";
addView.params = [ { name : "showId" , type : "Number" , paramType : "path" , desc : "this show is viewed"}];
addView.paramType = "query";
app.get(addView.path , function (req, res) {
    var showid = req.param("showId");
    service.showService.addView(showid , function(){
        app.sendSuccess(res , appUtil.appConstants.SUCCESS_RESPONSE);
    })
});

var getShowSchedule = {}
getShowSchedule.nickname = "getShowSchedule"
getShowSchedule.path = "/shows/schedule"
getShowSchedule.method = "POST"
getShowSchedule.paramType = "form"
getShowSchedule.params = [
    { name : "fromDate" ,   type : "string" , required : false , desc : "Date in Milliseconds"},
    { name : "toDate" ,   type : "string" , required : false , desc : "Date in Milliseconds"},
    { name : "date" ,   type : "string" , required : false , desc : "Date in YYYYMMDD format like 20151122"},
    { name : "showId" , type : "number" , required : false , desc : "show id"},
    { name : "channelId" , type : "number" , required : false , desc : "channel id"},
    { name : "minRat" , type : "number" , required : false , desc : "Minimum Rating"},
    { name : "maxRat" , type : "number" , required : false , desc : "Maximum Rating"},
]
app.post(getShowSchedule.path , function(req , res){
    var filters = _getFilters(req);
    service.showService.findSchedule( filters , function(shows){
        app.sendSuccess(res , shows)
    })
});

var submitFeedback = {}
submitFeedback.nickname = "postComment"
submitFeedback.path = "/shows/feedback/submit"
submitFeedback.method = "POST"
submitFeedback.paramType = "form"
submitFeedback.params = [
    { name : "showId" , type : "number" , required : false , desc : "showId"},
    { name : "name" , type : "number" , required : false , desc : "username"},
    { name : "title" , type : "number" , required : false , desc : "title"},
    { name : "comment" , type : "number" , required : false , desc : "User Comment"},
    { name : "rating" , type : "number" , required : false , desc : "1 to 5"},
]
app.post(submitFeedback.path , function(req , res){
    var userId = appUtil.sessionUtil.getUserId(req.session);
    var data = helper.validateComment( userId , req.body);
    service.showService.addComment( data , function(){
        app.sendSuccess(res , appUtil.appConstants.SUCCESS_RESPONSE)
    })
});

var getFeedback = {}
getFeedback.nickname = "getFeedback"
getFeedback.path = "/shows/feedback"
getFeedback.method = "GET"
getFeedback.paramType = "query"
getFeedback.params = [
    { name : "showId" , type : "number" , required : false , desc : "showId"},
]
app.get(getFeedback.path , function(req , res){
    var showId = parseInt(req.query.showId);
    service.showService.getComments( showId , function(comments){
        var result = {};
        result.showId = showId;
        result.average = d3.mean(_.pluck( comments , "rating"));
        result.comments =  comments;
        app.sendSuccess(res , result);
    })
});



module.exports = {
    apis : [findShows ,whatshot , mostviewed, addView , getShowSchedule, submitFeedback , getFeedback]
}

function _getFilters(req){
    var filters = {};
    filters.term = req.body.term;
    filters.date = req.body.date;
    filters.minRat = req.body.minRat;
    filters.maxRat = req.body.maxRat;
    if(!appUtil.isNullOrBlank(req.body.toDate)){
        filters.toDate = appUtil.getDayEndTime(req.body.toDate);
    }
    if(!appUtil.isNullOrBlank(req.body.fromDate)){
        filters.fromDate = appUtil.getDayStartTime(req.body.fromDate);
    }
    if(!appUtil.isNullOrBlank(req.body.skip)){
        filters.skip = parseInt(req.body.skip);
    }else{
        filters.skip = 0;
    }

    if(!appUtil.isNullOrBlank(req.body.count)){
        filters.count = parseInt(req.body.count);
    }else{
        filters.count = 30;
    }
    if(!appUtil.isNullOrBlank(req.body.categoryId)){
        filters.categoryId = parseInt(req.body.categoryId);
    }
    if(!appUtil.isNullOrBlank(req.body.channelId)){
        filters.channelId = parseInt(req.body.channelId);
    }
    if(!appUtil.isNullOrBlank(req.body.showId)){
        filters.showId = parseInt(req.body.showId);
    }
    appUtil.removeNullKeys(filters);
    return filters;
}