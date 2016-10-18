/**
 * Created by anil on 4/7/15.
 */
var appUtil = require('../appUtil/appUtil');
var app = require("../app");
var domain = require('domain');
var logger = require('../appUtil/appUtil').logger;
console.log('==========nnnnn');
function handleError(err, res, req){
    console.log(err)
    if(err.errorCode){
        if(err.error) console.warn(err.error.stack);
        if(! req._dumped){
            res.send(appUtil.getErrorResponse(err));
        }
    }else{
        res.send(appUtil.getErrorResponse(appUtil.exceptions.getUnknownErrorException()));
    }
}

app.sendSuccess = function(response, result){
    var res= appUtil.getSuccessResponse(result);
    //This will print all responses
    console.log('hhhhhvhgvhemabddeahndk jeamhdbhmngdbwejhngehja')
    console.log(JSON.stringify(res));
    response.send(res);
};

app.use(function(req, res, next){
    setHeadersForCrossDomainIssues(res);
    var d = domain.create();
    d.members.push({dbCalls : 0});

    d.on("error", function(err){
        handleError(err, res, req);
    });
    console.log('==========jjjjjj');
    var _next = d.bind(function(){
        next();
        res.on('finish', function(){
            console.log('finishmmmmmmm');
            if(domain.active && domain.active.members.length){
                console.log('finishmmmmmmmactive');
                domain.active.members[0].dbCalls=0;
            }
        });
    });
    _next();
});

/**
 * Log the calls
 */
//app.use(logger.requestLogger);
//This Interceptor will intercept all imcoming requests
var interceptor = require('../config/requestInterceptor');

//Add Rest of Controllers Here
require("./channelController");
require("./showController");
require("./userController");
require("./appController");
require("./cronController");


//Handle errors
app.use(function(err, req, res, next) {
    handleError(err, res, req);
});

function setHeadersForCrossDomainIssues(response){
    response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'X-PINGOTHER');
    response.set('Access-Control-Allow-Origin', appUtil.appConstants.env.WEBSITE_URL);
    response.set('Access-Control-Allow-Credentials', true);
}
