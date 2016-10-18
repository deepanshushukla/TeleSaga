/**
 * Created by anil on 4/7/15.
 */
var _ = require("lodash");
exports.User =
    /**
     *
     * @param data
     * did : device id
     * pt : platform : 1 for iOS , 0 for android
     * fbToken : Facebook Token
     * gplus Token : Google+ Token
     * fbId : fb Id
     * acd : account Creation Date
     * isActive : isActive
     * displayPic : Display Picture
     * fbImageUrl : facebook Image url
     * gplusImageUrl : Google Plus Image url
     * @constructor
     */
        function(data){
            this.name = data.name;
            this.email = data.email;
            this.pwd = data.pwd;
            this.phone = data.phone;
            this.did = data.did;
            this.acd = data.acd;
            this.pos = data.pos;
            this.role = data.role;
            this.gender = data.gender;
            this.pt = parseInt(data.pt);
            this.displayPic = data.displayPic;
            this.gplusToken = data.gplusToken;
            this.fbToken = data.fbToken;
            this.fbId = data.fbId;
            this.gid = data.gid;
            this.isActive = data.isActive;
            this.fbImageUrl = data.fbImageUrl;
            this.gplusImageUrl = data.gplusImageUrl ;
            this.brandPrefs = data.brandPrefs;
            this.storePrefs = data.storePrefs;
            this.likes = data.likes;
            return _.pick(this , _.identity);
    };

/**
 *
 * @param data
 * @constructor
 */
exports.Comment = function (userId , name , title , comment , rating , showId) {
    this.userId = userId;
    this.name = name;
    this.title = title;
    this.comment = comment;
    this.rating = rating;
    this.showId = showId;
    return _.pick(this , _.identity);
}