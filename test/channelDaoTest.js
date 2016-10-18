/*
/!**
 * Created by anil on 17/8/15.
 *!/

var assert = require("assert");
var mongo = require("../dao/daoConfig");


describe("ChannelDao" , function(){

    before(function(done){
        mongo.init("telesaga", function(){done()});
    });
    describe("findChannelWithNoCategory", function () {
        it.only("Get List of Channel With No Entries" , function(done){
            var channelDao = require("../service/channelService")
            channelDao.findChannelWithNoCategory(function(categories){
                console.log(categories);
                done();
            });
        })
    })

})
*/
