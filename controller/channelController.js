/**
 * Created by anil on 4/7/15.
 */
var app = require("../app")
var service = require("../service")
var appUtil = require("../appUtil/appUtil")


var findChannels = {}
findChannels.nickname = "findShows"
findChannels.path = "/channel/find"
findChannels.method = "POST"
findChannels.paramType = "form"
findChannels.params = [
    { name : "skip" , type : "number" , required : true , desc : "skip this count"},
    { name : "count" , type : "number" , required : true , desc : "return this number of results"},
    { name : "categoryId" , type : "string" , required : false , desc : "Category Id"},
    { name : "channelId" , type : "string" , required : false , desc : "Channel Id"},
    { name : "minRat" , type : "number" , required : false , desc : "Minimum Rating"},
    { name : "maxRat" , type : "number" , required : false , desc : "Maximum Rating"},
    { name : "term" , type : "string" , required : false , desc : "Search Term"}
]
app.post(findChannels.path , function(req , res){
    var filters = _getFilters(req);
    service.channelService.findChannels( filters , function(done){
        app.sendSuccess(res , done)
    })
});

var getChannelCategories = {}
getChannelCategories.nickname = "getChannelCategories"
getChannelCategories.path = "/channel/category/list"
getChannelCategories.method = "GET"
app.get(getChannelCategories.path , function(req , res){
    service.categoryService.getCategoryList(function(done){
        app.sendSuccess(res , done)
    })
});



function _getFilters(req){
    var filters = {};
    filters.term = req.body.term;

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
    if(!appUtil.isNullOrBlank(req.body.minRat)){
        filters.minRat = parseInt(req.body.minRat);
    }
    if(!appUtil.isNullOrBlank(req.body.maxRat)){
        filters.maxRat = parseInt(req.body.maxRat);
    }
    if(!appUtil.isNullOrBlank(req.body.channelId)){
        filters.channelId = parseInt(req.body.channelId);
    }
    if(!appUtil.isNullOrBlank(req.body.categoryId)){
        filters.categoryId = parseInt(req.body.categoryId);
    }
    appUtil.removeNullKeys(filters);
    return filters;
}

module.exports = {
    apis : [findChannels , getChannelCategories  ]
}