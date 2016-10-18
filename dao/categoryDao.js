/**
 * Created by anil on 4/7/15.
 */

var model = require("../model/model");
var baseDao = require("./baseDao");
var _ = require("lodash");
var appUtil = require("../appUtil/appUtil");
var commonFields = { name : true , cid : true };
var basicOperations = new baseDao.basicOperations('category');
var appConstants = appUtil.appConstants;

var categoryColl = baseDao.getColl("category");

categoryColl.ensureIndex(  { cid : 1 }, { unique: true ,sparse: true}, function(err, res){
    console.log("ensuring index for category id on category collection .","err",err,"res",res);
});
categoryColl.ensureIndex(  { name : 1 }, { unique: true ,sparse: true}, function(err, res){
    console.log("ensuring index for category name on category collection .","err",err,"res",res);
});

module.exports  = {

    /**
     *
     * @param show : { name , cid }
     * @param callback
     */
    addCategory : function(category  , callback){
        var callback1 = function(inserted){ }
        categoryColl.insert(category , baseDao._callback(callback1,true))
    },
    addCategoryBulk : function(categoryList){
        categoryColl.drop();
        var bulk = categoryColl.initializeUnorderedBulkOp();
        _.each( categoryList , function (category) {
            bulk.insert(category)
        })
        bulk.execute(function (err,BulkWriteResult) {});
    },
    findCategoryById : function(cid , callback){
        categoryColl.findOne({cid : cid } , baseDao._callback(callback))
    },
    getAll : function(callback){
        categoryColl.find().toArray(baseDao._callback(callback));
    },
    findOrGenerateCategory : function(name , callback){
        var callback1 = function (category) {
            if(category){
                callback({ name : category.name , categoryId : category.categoryId})
            }else{
                module.exports.generateCatId(name , callback);
            }
        }
        categoryColl.findOne({name : name } , baseDao._callback(callback1))
    },
    generateCatId : function (name , callback) {
        var randomCatId;
        var generateCatId = function (category , cb) {
            categoryColl.insert(category , baseDao._callback(cb,true))
        }
        var callback1 = function(err , res){
            if(err){
                randomCatId = Math.random()  * 1000;
                generateCatId({categoryId : randomCatId , name : name} , callback1)
            }else{
                callback({categoryId : randomCatId , name : name})
            }
        }
        callback1(true);
    }
}
