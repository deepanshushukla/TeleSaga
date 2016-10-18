/**
 * Created by anil on 4/7/15.
 */
var scrapManager = require("../scrap/scrapManager")
var dao = require("../dao")

module.exports = {

    findShows : dao.showDao.findShows,
    findSchedule : dao.showDao.findSchedule,
    addView : dao.showDao.addView,
    getComments : dao.showDao.getComments,
    getMostLikedShows : dao.showDao.getMostLikedShows,
    getMostViewedShows : dao.showDao.getMostViewedShows,

    /**
     *
     * @param comment
     * @param callback
     */
    addComment: function (comment , callback) {
        dao.showDao.postComment(comment,function(err , ObjectInserted){
            if(ObjectInserted && ObjectInserted.ops && ObjectInserted.ops[0] && ObjectInserted.ops[0]._id){
                dao.showDao.addComment(comment.showId , ObjectInserted.ops[0]._id , callback);
            }
        })
    },

}
