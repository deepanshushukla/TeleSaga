/**
 * Created by anil on 16/8/15.
 */

var scrapManager = require("../scrap/scrapManager")
var dao = require("../dao")
var appUtil = require("../appUtil/appUtil")
var channelService = require("./channelService")
var Promise = require("bluebird")
var _ = require("lodash")

module.exports = {

    regenerateChannelCategoryData : function(){

        return scrapManager.getChannelCategoryList()

            .then(function(categories){
                //Categories Will Be Added Asynchronously
                dao.categoryDao.addCategoryBulk(categories);
            })
    },

    regenerateChannelData : function(){

        return scrapManager.getChannelList()

            .then(function(channels){
                return Promise.promisify(dao.channelDao.addChannelBulk)(channels);
            })
            .then(function () {
                channelService.findFixChannelWithNoCategory();
            })
    },
    /**
     * @generates data of 7th day by default
     * @param fetchFullWeekData : generate date of all week
     * @return {*}
     */
    generateShowData :  function( fetchFullWeekData){

        return dao.channelDao.getChannelList({channelId:true})

        .then(function(channels){
            var addUpdateShowSchedule = [];
            console.log('showsshowsshowsshowsshowsshows', channels);
            //Iterate and add Show of Each Channel
            _.each(channels , function(channel){
                addUpdateShowSchedule.push(function(){
                    return scrapManager.getShowList(channel.channelId , fetchFullWeekData )
                    .then(function(shows){
                        console.log('showsshowsshowsshowsshowsshows', shows);
                        dao.showDao.addShowBulk(shows)
                        dao.showDao.addScheduleBulk(shows)
                    })
                }())
            })
            return Promise.all(addUpdateShowSchedule)
        });
    },

    generateShowThumbnails : function(){

        return dao.showDao.getShowList()
        
            .then(function (shows) {

                var updateImages = [];
                _.each(shows, function(show){
                    updateImages.push(function(){
                        return scrapManager.fetchImageForShow(show.showId , show.link)
                        .then(function(fetchedShow){
                            dao.showDao.updateImage( fetchedShow.showId , fetchedShow.image );
                        })
                    }())
                });
                return Promise.all(updateImages);
            })
    }


    //Write Cron for Reuploading Image to AWS
    //Write Cron to Add Show Timings to Show
    //Write Cron to Fetch Show of 7th Day & Move All to Previous List
}