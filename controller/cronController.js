/**
 * Created by anil on 18/8/15.
 */
var app = require("../app")
var appUtil = require("../appUtil/appUtil")
var service = require("../service")




var regenerateAllData = {}
regenerateAllData.nickname = "regenerateAllData"
regenerateAllData.method = "POST"
regenerateAllData.params = [{ name : "key" , type : "String"}]
regenerateAllData.path = "/data/all/regenerate"
regenerateAllData.paramType = "form";
app.post(regenerateAllData.path , function(req , res){
    if( req.body.key != "9sum5is14"){
        throw appUtil.exceptions.getUnAuthorizedAccessException();
    }
    updateAppData(true)
    .then(function(){
        app.sendSuccess(res , 1)
    })
});

var regenerateShowData = {}
regenerateShowData.nickname = "regenerateShowData"
regenerateShowData.method = "POST"
regenerateShowData.params = [{ name : "key" , type : "String"}]
regenerateShowData.path = "/data/show/regenerate"
regenerateShowData.paramType = "form";
app.post(regenerateShowData.path , function(req , res){
    if( req.body.key != "9sum5is14"){
        throw appUtil.exceptions.getUnAuthorizedAccessException();
    }
    updateAppData()
        .then(function(){
            app.sendSuccess(res , 1)
        })
});

var regenerateImageData = {}
regenerateImageData.nickname = "regenerateImageData"
regenerateImageData.method = "POST"
regenerateImageData.params = [{ name : "key" , type : "String"}]
regenerateImageData.path = "/data/image/regenerate"
regenerateImageData.paramType = "form";
app.post(regenerateImageData.path , function(req , res){
    if( req.body.key != "9sum5is14"){
        throw appUtil.exceptions.getUnAuthorizedAccessException();
    }
    updateAppData(null ,true)
        .then(function(){
            app.sendSuccess(res , 1)
        })
});

exports.apis = [ regenerateImageData , regenerateAllData , regenerateShowData ];

var runCronForDataUpdate = function(updateAll){
    //Run Cron at Midnight
    var timeLeft = appUtil.getMidnightTime() - appUtil.getCurrentTime();

    //Set Timer for Midnight
    setTimeout(function () {
        updateAppData(updateAll);
        runCronForDataUpdate();
    }, timeLeft);
}



function updateAppData( updateAll , generateImageData ){
    var action;
    if(updateAll){
        //Regenerate All Date
        action = service.dataService.regenerateChannelCategoryData()

        .then(function(){
            return service.dataService.regenerateChannelData();
        })
        .then(function(){
            return service.dataService.generateShowData(updateAll);
        })
        .then(function () {
            return service.dataService.generateShowThumbnails();
        })

    }else if(generateImageData){
        action = service.dataService.generateShowThumbnails();
    }else{
        //Regenerate Only Show Data
        action = service.dataService.generateShowData();
    }
    return action.catch(function (err) {
        console.log(err)
    });

}
//Start Cron
runCronForDataUpdate();

//service.dataService.generateShowThumbnails().catch(function (err) {
//    console.log(err)
//});