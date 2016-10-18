/**
 * Created by anil on 4/7/15.
 */
var model = require("../model/model");
function isUserLoggedIn(session){
    if(! session){
        return false;
    }
    return session.user !=null ;
};

module.exports = {
    loginUserIntoSession : function(session, user, IsDeviceUnset){
        session.user = user;
        var userDao = require("../dao/userDao");
        var sessionDao = require("../dao/sessionDao");
        //Fetch Existing Sessions Of This User
        userDao.getUserSessions(user._id , function( data ){

            //Invalidate Existing Sessions
            if(data.sessions && data.sessions.length > 0){
                sessionDao.invalidateSessions(data.sessions);
            }
            //Add This Session to User Sessions
            userDao.addUserSessions(user._id  ,session.id ,IsDeviceUnset, function(res){
                session.user = user;
            });
        });
    },
    getLoggedInUserDetail : function(session, throwError){
        _throwError(throwError, session);
        if(isUserLoggedIn(session)){
            return session.user;
        }else{
            return null;
        }
    },
    isUserLoggedIn : isUserLoggedIn,
    getUserId : function(session, throwError){
        _throwError(throwError, session);
        if(isUserLoggedIn(session)){
            return session.user._id;
        }else{
            return null;
        }
    },
    /**
     *
     * @param req
     */
    regenerateSession : function(req){
        req.sessionStore.regenerate(req , function(err){}); //The callback function is required in this method, We May Log Error Here
    },
    clearSession : function(session){
        session.destroy();
    }
}

function _throwError(throwError, session){
    if(throwError && ! isUserLoggedIn(session)){
        var e = new model.AppException("sinv0123", "We could not fetch session from your request. Please login again to continue."+
            " Make sure your cookies are enabled.");
        throw e;
    }
}