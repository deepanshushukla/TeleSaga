/**
 * Created by anil on 7/9/15.
 */

var app = require("../app")
var service = require("../service")
var appUtil = require("../appUtil/appUtil")

var reportProblem = {}
reportProblem.nickname = "followShow"
reportProblem.path = "/me/show/follows";
reportProblem.method = "GET";
app.get(reportProblem.path , function (req, res) {
    var user = appUtil.sessionUtil.getLoggedInUserDetail(req.session , true);
    var showId = req.params.showId;
    var follow = appUtil.parseBoolean(req.params.follow);
    service.userService.getFollowedShows( user._id , function(done){
        app.sendSuccess(res , 1)
    })
});




module.exports = {
    apis : [/*reportProblem*/]
}
