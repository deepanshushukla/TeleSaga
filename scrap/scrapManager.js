/**
 * Created by anil on 4/7/15.
 */
var request = require("request")
var Promise = require("bluebird")
var cheerio = require("cheerio")
var dateUtil = require("../appUtil").dateUtil;
var DEFAULT_CID_ALL = 123;

module.exports = {

    getChannelCategoryList : function (callback) {

        var promise = new Promise(function (resolve , reject) {
            var masterCatUrl = "http://www.in.com/tv/";
            request( masterCatUrl , function (error , res , html) {
                console.log('=======getChannelCategoryList======', res, '====tttttt====');
                var $ = cheerio.load(html);
                var catList = [];
                console.log($(".top_menu_ul li"));
                $(".top_menu_ul li").add(".more_list_gray_box li").each(function ( index , elem) {
                    var category = { type : "channel"}
                    category.name = $(this).find("a").text().trim();
                    if(category.name == "All"){
                        category.categoryId = DEFAULT_CID_ALL;
                    }else{
                        category.categoryId = getCategoryIdFromUrl($(this).find("a").attr("onclick"))
                    }
                    console.log('categoryyyyyyyy', category);
                    catList.push(category);
                })
                //Return All Cateogories Object Array
                resolve(catList);
            })
        })
        return promise;
    },

    getChannelList : function(callback){

        var promise = new Promise(function (resolve , reject) {

            var masterChannelUrl = "http://www.in.com/ajax/getChannelSubContent.php?cid=[cid]&language=&page=";

            var counter = 0;
            var channels = [];
            for (var i = 1; i <= 20; i++) {
                for (var j = 1; j <= 20; j++) {
                    counter++;
                    request(masterChannelUrl.replace("[cid]", i) + j, function (error, res, html) {
                        var $ = cheerio.load(html);
                        var categoryId = null;
                        if ($(".drop_box_list li").length != 0) {
                            categoryId = getCategoryIdFromUrl($(".drop_box_list li").first().find("a").attr("onclick"));
                        }
                        var category = $(".top_bar h3").text().replace("Browsing", "").replace("Channels", "").trim()
                        $("div.channels_frame_block").each(function (index, elem) {
                            var channel = {};
                            channel.link = $(this).find("a").attr("href")
                            channel.image = $(this).find(".channels_frame img").attr("src")
                            channel.name = $(this).find(".channels_frame img").attr("title");
                            channel.searchName = channel.name.toLowerCase();
                            channel.category = category;
                            channel.categoryId = categoryId;
                            channel.channelId = parseInt(channel.link.replace(".html", "").substring(channel.link.lastIndexOf("-") + 1))
                            channels.push(channel)
                        });
                        if (--counter == 0) {
                            resolve(channels);
                        }
                    });
                }
            }
        });
        return promise;
    },

    getShowList : function(cid , fetchFullWeekData){
        var promise = new Promise(function (resolve , reject) {
            var showList = [];
            var counter = 0;
            var day= fetchFullWeekData ? 0 : 6;
            while(day++ < 7){
                counter++;
                var masterShowLink = "http://www.in.com/ajax/getChannelSchedule.php?cid=[cid]&dt=[dt]&display=full".replace("[cid]",cid);
                var currentDate = dateUtil.addDays(new Date(),day);
                var dt = dateUtil.getYYYYMMDDFormat(currentDate);
                currentDate.setHours(0,0,0);
                masterShowLink = masterShowLink.replace("[dt]",dt );
                var saveShows =  function (date , currentDate) {
                    return function (error, res, html) {
                        var $ = cheerio.load(html);
                        $("div.schedule_grid").each(function (index, elem) {
                            var show = {};
                            show.date = date;
                            show.fullDate = currentDate.getTime();
                            show.link = $(this).find("a").attr("href")
                            show.image = $(this).find("img").attr("src")
                            show.time = replaceSpaces($(this).find(".schedule_details p.info").text().trim())
                            show.name = replaceSpaces($(this).find(".schedule_details p.title a").text().trim());
                            show.searchName = show.name.toLowerCase();
                            show.genre = replaceSpaces($(this).find(".schedule_details p.description").text().trim());
                            show.fullDateWithTime = dateUtil.setTime(currentDate , show.time).getTime();
                            show.day = day;
                            show.likeCount = 0;
                            show.viewCount = 0;
                            show.showId = parseInt(show.link.replace(".html", "").substring(show.link.lastIndexOf("-") + 1))
                            show.channelId = cid;
                            showList.push(show)
                        });
                        if (--counter == 0) {
                            resolve(showList);
                        }
                    }
                }
                request(masterShowLink , saveShows(dt,currentDate));
            }
        })
        return promise;
    },

    fetchImageForShow : function(showId , showLink){
        var promise = new Promise(function (resolve , reject) {
            var fetchImage = function (error, res, html) {
                try{
                    var $ = cheerio.load(html);
                    var image = $("span.photo12 img").attr("src");
                }catch(err){
                    return resolve( { showId : null , image : null})
                }
                resolve( { showId : showId , image : image})
            }
            request(showLink , fetchImage);
        })
        return promise;
        }

}

function replaceSpaces(string){
    return string.replace(/\s\s+/g, ' ');;
}

function getCategoryIdFromUrl(url){
    url = url.substr(url.indexOf("cid")).split("',");
    url[0] =url[0].split("&")[0];
    if(url.length == 1){
        //Error No category Id Mentioned in URL
        return;
    }
    return isNaN(url[0].replace("cid=","")) ? undefined : parseInt(url[0].replace("cid=",""));
}