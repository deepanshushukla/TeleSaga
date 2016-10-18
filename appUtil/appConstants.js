/**
 * Created by anil on 4/7/15.
 */
var fs = require('fs');
var path = require('path');

function getUserHome(){
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}
var homeDir = getUserHome();

var system = {
    "AWS_ACCESS_KEY": "AKIAJN6ZDN75Q4H5UKUA",
    "AWS_SECRET_KEY": "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",
    "AWS_BUCKET_NAME": "buzzl-bucket-2",
    "S3_ENDPOINT": "https://buzzl-bucket-2.s3.amazonaws.com"
}

var ENV = {
    APP_BASE_URL : "http://52.25.93.200:3001",
    WEBSITE_URL : "http://52.25.93.200:3001",
    //APP_BASE_URL : "http://localhost:3001",
    //WEBSITE_URL : "http://localhost:3001",
    AWS_BUCKET_NAME	: system.AWS_BUCKET_NAME,
    S3_ENDPOINT : system.S3_ENDPOINT,
    AWS_SECRET_KEY  : system.AWS_SECRET_KEY,
    AWS_ACCESS_KEY : system.AWS_ACCESS_KEY
}

var DB_CONSTANTS = {
    DB_NAME : "telesaga",
    DB_USER : "telesaga",
    DB_PASS : "@telesaga@"
}

var PATHS = {
    DOWNLOAD_DIR : path.join(homeDir , "uploads/telesaga"),
    UPLOAD_DIR : path.join(homeDir , "uploads/telesaga")
}

var TIME_UNIT = {
    ONE_DAY : 24*60*60*1000
}

module.exports = {
    env : ENV,
    SUCCESS_RESPONSE : 1,
    DB_CONSTANTS : DB_CONSTANTS,
    PATHS : PATHS,
    TIME_UNIT : TIME_UNIT,
    MAX_RESULTS : 50
}
