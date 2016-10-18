/**
 * Created by anil on 4/7/15.
 */
var model = require('../model/model');
var crypto = require('crypto');

/**
 *
 * @param val
 * @return md5 encrypt given value
 */
var getMd5 = function(val){
    var md5 = crypto.createHash('md5');
    md5.update(val);
    return md5.digest('hex');
};

/**
 * returns current time in utc
 * @returns {number}
 */
var _getCurrentTime = function(){
    var date = new Date();
    return date.getTime() - (date.getTimezoneOffset()*60*1000);
};
var seq = _getCurrentTime() ;

module.exports = {

    appConstants : require("./appConstants"),
    exceptions : require('./exceptionGenerator'),
    appHttpClient : require('./appHttpClient'),
    sessionUtil : require('./sessionUtil'),
    mediaUtil : require('./mediaUtil'),
    dateUtil : require('./dateUtil'),
    logger : require('./logger'),
    swaggerUtil : require("./swaggerUtil"),


    getErrorResponse : function(err){
        return new model.APIResponse(0, err);
    },
    getSuccessResponse : function(res){
        return new model.APIResponse(1, res);
    },

    getNextSequence : function(){
        return seq++;
    },
    /**
     * returns current time in utc
     * @returns {number}
     */
    getCurrentTime : _getCurrentTime ,
    /**
     * return upcoming 12:00 am of today
     * @return {number}
     */
    getMidnightTime : function(){
        return new Date().setHours(24,0,0,0);
    },
    getDayStartTime : function(timeInMillis){
        var date;
        if(timeInMillis){
            date = new Date(timeInMillis);
        }else{
            date = new Date();
        }
        return date.setHours(0,0,0,0);
    },
    getDayEndTime : function(timeInMillis){
        var date;
        if(timeInMillis){
            date = new Date(timeInMillis);
        }else{
            date = new Date();
        }
        return date.setHours(23,59,59,0);
    },
    isNullOrBlank : function (string) {
        if(!string || string == ""){
            return true;
        }
        return false;
    },
    /**
     * Removes Null Keys from object
     * @param ob
     */
    removeNullKeys : function(ob){
        for(var i in ob){
            if(ob[i]==null || (isNaN(ob[i]) && typeof ob[i] == "number")){
                delete ob[i];
            }
        }
        return ob;
    },
    isObject : function(arg){
        if(arg && typeof arg == "object"){
            return true;
        }
        return false;
    },
    /**
     * returns if email is valid or not
     * @returns {boolean}
     */
    isValidEmail : function (eml) {
        var pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
        return new RegExp(pattern).test(eml);
    },
    /**
     *
     * @param str
     * @returns {boolean}
     */
    parseBoolean : function(str) {
        if(str === undefined){
            return str;
        }
        switch (String(str).toLowerCase()) {
            case "true":
            case "1":
            case "yes":
            case "y":
                return true;
            case "false":
            case "0":
            case "no":
            case "n":
            default:
                return false;
        }
    },
    isArrayNullOrBlank : function (array) {
        if( array == undefined || array == "" || array.length==0){
            return true;
        }
        return false;
    }
}