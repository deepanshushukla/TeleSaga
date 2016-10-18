/**
 * Created by anil on 4/7/15.
 */

var model = require("../model/model")

module.exports = {

    getUnknownErrorException : function(){
        return new model.AppException("ukn001" , "Something went wrong...")
    },
    getDBException : function(err){
        return new model.AppException("db002" , "Database error...",err)
    },
    getUnAuthorizedAccessException : function(err){
        return new model.AppException("une404" , "You are not authorized to perform this action.",err)
    },
    getIncorrectFbTokenException : function(){
        return new model.AppException("invfb003" , "Incorrect FB Token Exception...")
    },
    getInvalidEmailException : function(){
        return new model.AppException("invem004" , "Unable to fetch Email from FB...")
    },
    getUserNotFoundException : function () {
        return new model.AppException('invem005', "Unable to find user with this email/password");
    },
    getErrorUploadingMediaException : function(err){
        return new model.AppException("eum005" , "Error Uploading Media to Server...",err)
    },
    getErrorUpdatingUserException : function(){
        return new model.AppException("euu006" , "Error Updating User...")
    },
    getPleaseProvideCommentDataException : function () {
        return new model.AppException("pcd007" , "Name/Title/Comment/Ratings(1-5) are necessary to Post Comment.")
    }
}