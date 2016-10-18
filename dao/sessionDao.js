/**
 * Created by anil on 4/7/15.
 */
/**
 * Created by anil on 4/2/15.
 */
var baseDao = require("./baseDao");
var sessionsColl = baseDao.getColl('sessions');

module.exports = {
    /**
     * @removes sessionsIds from Session Collection
     * @param sessionIds
     * @param callback
     */
    invalidateSessions : function(sessionIds , callback){
        sessionsColl.remove({ _id : {$in : sessionIds}} , baseDao._callback(callback));
    }
}
