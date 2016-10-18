/**
 * Created by anil on 21/11/15.
 */

FB_PROFILE_FETCH_URL = "https://graph.facebook.com/me?fields=email,first_name,id,last_name,name,gender,picture.type(square).width(300).height(300)&access_token=";

module.exports = {
    /**
     * [getFBProfile description]
     * @param  {[type]}   token    [description]
     * @param  {Function} callback(fbUser) - fbUser is jsonObject with fields
     *                                     first_name, last_name, id, email, gender;
     * @return {[type]}            [description]
     */
    getFBProfile : function(token, callback){
        var appUtil = require('../appUtil/appUtil');
        appUtil.appHttpClient.getSecure(FB_PROFILE_FETCH_URL+token, function(resp){
            var retVal = JSON.parse(resp);
            if(retVal.error){
                throw appUtil.exceptions.getIncorrectFbTokenException();
            }
            if(!retVal.email){
                throw appUtil.exceptions.getInvalidEmailException();
            }
            callback(retVal);
        });
    }
}