/**
 * Created by anil on 22/6/15.
 */
var cheerio = require("cheerio");
var request = require('request');
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var express = require("express");
var app = module.exports = express();
var session = require('express-session');
var dbName = require("./appUtil/appConstants").DB_CONSTANTS.DB_NAME;
var MongoStore = require('connect-mongo')(session);
var mongodb = require('./dao/daoConfig');
/**
 * Middleware for handling multipart/form-data.
 * https://github.com/expressjs/multer
 */
var multer  = require('multer');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
var uploadingDir = require('./appUtil/appUtil').appConstants.PATHS.UPLOAD_DIR;


mongodb.init(dbName , function(){
    var cookieSecret = 'someRandomSecretHereToAvoidCookieTempering';
    
    app.use(session({
        secret: cookieSecret, //This is the secret used to sign the session ID cookie
        resave : true, //Forces the session to resave to session store even if it was unmodified during request
        saveUninitialized : true,//Forces a session that is "uninitialized"(new but not modified) to be saved to the store
        store : new MongoStore({ //store for storing session ,default is new MemoryStore instance.
            db : dbName,
            port: '27017',
            url: 'mongodb://localhost:27017/telesaga'
        })
    }));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(multer({ dest: uploadingDir}));
    //console.log('==========',uploadingDir);
    //Add Controllers To Domain
    require('./controller/primaryController');
    require("./config/swaggerConfig");
    app.listen(3001)
    console.log('==========mmmmmmmmm');
    //Swagger Page
    var docs_handler = express.static(__dirname + '/node_modules/swagger-ui/dist');
    app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
        if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
            res.writeHead(302, { 'Location' : req.url + '/' });
            res.end();
            return;
        }
        // take off leading /docs so that connect locates file correctly
        req.url = req.url.substr('/docs'.length);
        return docs_handler(req, res, next);
    });
})
/*

app.get('/test/pubnub', function (req, res) {
    var content = { me : req.param("me") , to : req.param("to")};
    res.render('pubnub.html',{ data: JSON.stringify(content)});
});

function startDownloading(){
    var toFetch = "http://www.hj-story.com/comics/page/";
    var counter = 0;
    var urls = [];
    for(var i= 0 ;i<= 25;i++){
        counter++;
        request(toFetch+i,function (error , res , html) {
            // free memory associated with the window
            var $ = cheerio.load(html);
            var images = $(".blog-media-wrapper.gdl-image a");
            for(var index in images){
                if(isNaN(index))
                    continue;
                var url = $(images[index]).attr("href");
                if(!url || url.indexOf("#") != -1)
                    continue;
                urls.push(url);
            }
            if(--counter == 0){
                _fetchImages(urls)
            }
        });
    }
}

function _fetchImages(urls){
    var images = [];
    var counter = 0;
    for(var index in urls){
        counter++;
        request(urls[index] , function(error , res, html){
            counter--;
            var $ = cheerio.load(html);
            var image =  $("img.size-full");
            if(!image){
                return;
            }
            var imageUrl = image.attr("src");
            if(!imageUrl){
                return;
            }
            images.push(imageUrl);
            //if(counter == 0){
                getFileFromUrl(imageUrl);
            //}
        })
    }
}


function _downloadImages(images){
    for(var index in images){
        getFileFromUrl(images[index])
    }
}

function getFileFromUrl(url ,callback){
    var extension = url.substring(url.lastIndexOf(".")).replace(".","").split("?")[0];
    var protocol = http;
    var isHttps = _isHttps(url);
    if(isHttps){
        protocol = https;
    }
    protocol.get(url , function(res){
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function(chunk){
            imagedata += chunk
        })

        res.on('end', function(){
            var key = new Date().getTime()+".jpg";
            fs.writeFile("/home/anil/avid/files/"+key , imagedata, 'binary')
        })
    })
}

function _isHttps(url){
    if(url.indexOf("https")!= -1){
        return true;
    }
    return false;
}*/
