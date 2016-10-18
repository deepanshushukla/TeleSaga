/**
 * Created by anil on 4/7/15.
 */
var scrapManager = require("../scrap/scrapManager")
var dao = require("../dao")
var _ = require("underscore");

module.exports = {


    findFixChannelWithNoCategory : function () {
        //Find Channels With No category Names
        dao.channelDao.findChannelWithNoCategory(function(channels){
            //Create a Set
            channels = _.uniq(_.pluck(channels , "category"));
            var updateChCatIds = function (chCats) {
                //For Each Channel With No category Add and Update Category
                for(var index in chCats){
                    dao.channelDao.updateChannelCategory(chCats[index]);
                }
            }
            var newChCats = [];
            var counter = 0;
            for(var index in channels){
                counter++;
                dao.categoryDao.findOrGenerateCategory(channels[index] , function (category) {   //category = { name , categoryId}
                    newChCats.push(category);
                    if(--counter == 0){
                        updateChCatIds(newChCats);
                    }
                })
            }
        })
    },
    findChannels : function(filters , callback){
        dao.channelDao.findChannels(filters , callback);
    },

    findSchedule : function(filters , callback){
        dao.showDao.findShowsByChannel(filters , callback)
    }

}


/*
function _getUniqueCategories(channels){
    var Set = require("collections/set");
    var categorySet = new Set();
    for(var index in channels){
        categorySet.add(channels[index].category)
    }
    return categorySet.toArray();
}*/
