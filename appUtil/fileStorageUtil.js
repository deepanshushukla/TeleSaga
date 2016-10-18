/**
 * Created by anil on 14/7/15.
 */
//FIXME:: THis will be moved into separate module
var s3 = require('s3');
var model = require('../model/model');
var env = require("./appConstants").env
var bucketName = env.AWS_BUCKET_NAME;

var accessKeyId = env.AWS_ACCESS_KEY;
var secretAccessKey = env.AWS_SECRET_KEY;
var s3EndPoint = env.S3_ENDPOINT;

var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
        // any other options are passed to new AWS.S3()
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    }
});

module.exports = {
    /**
     *
     * @param source
     * @param id
     * @param callback
     * @param isChatMedia : is given media is uploaded during chat
     */
    upload : function(source, id, callback , isChatMedia){
        var params = {
            localFile: source,

            s3Params: {
                Bucket: bucketName,
                Key: id,
                ACL: "public-read",
                CacheControl : "max-age=31536000000"        // one year
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            }
        };
        var uploader = client.uploadFile(params);
        uploader.on('error', function(err) {
            callback(err, null);
        });
//        uploader.on('progress', function() {
//            console.log("progress", uploader.progressMd5Amount,
//                uploader.progressAmount, uploader.progressTotal);
//        });
        uploader.on('end', function(e) {
            callback(null, s3EndPoint+"/"+id);
        });
    },
    /**
     *
     * @param key
     * @param callback
     * @param isChatMedia : is given media is uploaded during chat
     */
    delete : function(key, callback , isChatMedia){
        var obs = [];
        for(var i in key){
            obs.push(
                /* required */
                {
                    Key: key /* required */
                }
                /* more items */
            );
        }
        var s3Params = {
            Bucket : bucketName,
            Delete : {
                Objects: obs
            }
            // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
        };
        var deleter = client.deleteObjects(s3Params);
        deleter.on("end", function(){
            callback(null, true);
        }).on("error", function(err){
            //logger.logException(err,"AWS");
            callback(err, false);
        });
    }


}