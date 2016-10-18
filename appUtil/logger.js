/*
/!**
 * Created by anil on 4/7/15.
 *!/
var domain = require('domain');
var loggly = require('loggly');
var serverName = require('./appConstants').env.SERVER_NAME;
var client = loggly.createClient({
    token : "ddb5ea64-653f-49cd-b7af-216e70d4d2f4",
    subdomain : "mobicules",
    tags : [ "avid" ],
    json : true
});

var INFO = function(obj, tag) {
    console.log("message ",obj, "tag", tag);
    log('INFO', obj, tag);
};

function log(level, message, tags) {
    if (message.constructor === String) {
        message = {
            msg : message
        };
    }
    message.serverName = serverName;
    message.level = level;
    if(tags){
        if (tags.constructor !== Array) {
            tags = [ tags ];
        }
        client.log(message, tags, function(err, result) {
            // Do something once you've logged
        });
    }else{
        client.log(message);
    }
};

var ERROR = function(obj, tag) {
    console.log("message ",obj, "tag", tag);
    log('ERROR', obj, tag);
};

var WARN = function(obj, tag) {
    console.log("message ",obj, "tag", tag);
    log('WARN', obj, tag);
};

var SEVERE = function(obj, tag) {
    console.log("message ",obj, "tag", tag);
    log('SEVERE', obj, tag);
};

module.exports = {
    INFO : INFO,
    ERROR : ERROR,
    WARN : WARN,
    SEVERE : SEVERE ,
    logException : function(err, tag){
        log("ERROR", err.stack, tag);
    },
    requestLogger : function(req, res, next) {
        var appUtil = require('./appUtil'); //	WHY WAS THIS NOT WORKING ABOVE
        var timeStart = new Date().getTime();
        if(domain.active && domain.active.members.length){
            var members = domain.active.members;
        }
        res.on('finish', function() {
            var time = new Date().getTime() - timeStart;
            //FIXME :: remove body and headers in case of prod
            var request = {
                path : req.path,
                query : req.query,
                method : req.method,
                resTime : time,
                headers : req.headers,
                body : req.body
                //	param : req.param
            };
            if(appUtil.sessionUtil.isUserLoggedIn(req.session)){
                request.userId = appUtil.sessionUtil.getUserId(req.session);
            }
            //if(domain.active && domain.active.members.length){
            //	request.dbCalls = domain.active.members[0].dbCalls;
            //}
            if(members){
                request.dbCalls = members[0].dbCalls;
            }
            INFO(request, "reqLog");
        });
        next();
    }
};*/
