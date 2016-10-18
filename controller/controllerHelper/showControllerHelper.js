/**
 * Created by anil on 21/11/15.
 */

var appUtil = require("../../appUtil/appUtil");
var model = require("../../model/model");
var _ = require("lodash");

exports.validateComment = function(userId , comment){
    if(appUtil.isNullOrBlank(comment.showId)){
        throw appUtil.exceptions.getPleaseProvideCommentDataException();
    }
    if(appUtil.isNullOrBlank(comment.name)){
        throw appUtil.exceptions.getPleaseProvideCommentDataException();
    }
    if(appUtil.isNullOrBlank(comment.title)){
        throw appUtil.exceptions.getPleaseProvideCommentDataException();
    }
    if(appUtil.isNullOrBlank(comment.comment)){
        throw appUtil.exceptions.getPleaseProvideCommentDataException();
    }
    if(appUtil.isNullOrBlank(comment.rating) || !_.contains(_.range(1,6),parseInt(comment.rating))){
        throw appUtil.exceptions.getPleaseProvideCommentDataException();
    }
    return new model.db.Comment( userId , comment.name , comment.title , comment.comment , parseInt(comment.rating), parseInt(comment.showId));
}