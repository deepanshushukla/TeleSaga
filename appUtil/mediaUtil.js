
/**
 * Created by anil on 21/11/15.
 */

var fileStorage = require("./fileStorageUtil")
var exceptions = require("./exceptionGenerator")
var gm = require("gm")

module.exports = {

    getMediaExtension : function(path){
        return path.substring(path.lastIndexOf("/")).replace("/","").split(".")[1]
    },
    //put your media related modules here
    /**
     *
     * @param image
     * @param callback
     * @param sizeArray : defaults to [300 , default]
     */
    uploadAndResizeImage : function(image ,  callback , sizeArray){
        if(!(sizeArray && sizeArray instanceof Array)){
            sizeArray = [300 ];
        }
        sizeArray.push("default");
        var extension = image.extension.replace(".","").toLowerCase();
        var appUtil = require("./appUtil")
        var imageData = {};
        var counter = 0;
        for(var index in sizeArray){
            image.name = appUtil.getNextSequence().toString() + "." + extension;
            counter++;
            module.exports.resizeImage( image , sizeArray[index] , function(err , imagePath , size , name){
                if(imagePath){
                    counter++;
                    module.exports.uploadMedia({path : imagePath , name : name} , function(imageUrl){
                        imageData[size] = imageUrl;
                        if(--counter == 0){
                            callback(imageData);
                        }
                    })
                }
                if(--counter == 0){
                    callback(imageData);
                }
            },image.name)
        }
    },
    uploadMedia : function( media , callback){
        var appUtil = require("./appUtil");
        fileStorage.upload(media.path, media.name, function(err, url){
            if(err){
                throw exceptions.getErrorUploadingMediaException(err);
            } else if(callback) {
                callback(url);
            }
        });
    },
    /**
     *
     * @param source : source path of image
     * @param dest : dest path
     * @param size : can be any size , output resolution will be size*size
     * @param callback
     */
    resizeImage : function(image,  size, callback , name){
        if(!size || size == "default")
            return process.nextTick(function(){
                if(!size)
                    callback(null,null,null,name)
                else
                    callback(null , image.path , "default",name)
            })
        var dest = image.path.toString().substring(0,image.path.lastIndexOf("/")+1) + image.name+"_"+size+".jpg";
        gm(image.path)
            .resize(size, size)
            .autoOrient()
            .write(dest, function (err) {
                if(err){
                    if(callback) callback(err);
                }else{
                    if(callback) callback(null , dest ,size ,name);
                };
            });
    }
}
