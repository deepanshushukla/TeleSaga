/**
 * Created by anil on 4/7/15.
 */

exports.AppException = function(errorCode, errorMessage, error){
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.error = error;
}
exports.APIResponse = function(statusCode, result){
    this.statusCode = statusCode;
    var appUtil = require('../appUtil/appUtil');
    this.time = appUtil.getCurrentTime();
    this.result = result;
}

exports.db = require('./db');