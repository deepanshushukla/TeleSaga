/**
 * Created by anil on 16/8/15.
 */

var scrapManager = require("../scrap/scrapManager")
var dao = require("../dao")

module.exports = {

    getCategoryList : function (callback) {
        dao.categoryDao.getAll(callback);
    }

}