/*
/!**
 * Created by anil on 4/7/15.
 *!/
var assert = require("assert");
var scrapManager = require("../scrap/scrapManager")

describe("ScrapManager" , function(){

    it.only("Fetches List of All Categories " , function(done){
        scrapManager.getChannelCategoryList(function(categories){
            console.log(categories);
            done();
        });
    })

    it("Fetches List of All Channels " , function(done){
        scrapManager.getChannelList(function(channels){
            console.log(channels);
            done();
        });
    })

    it("Fetches List of All Shows " , function(done){
        scrapManager.getShowList(66,function(shows){
            console.log(shows);
            done();
        });
    })

})
*/
