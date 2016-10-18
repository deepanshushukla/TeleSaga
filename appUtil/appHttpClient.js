/**
 * Created by anil on 4/7/15.
 */

var path = require("path")
var fs = require("fs")
var https = require("https")
var http = require("http")
module.exports = {

    postWithHeader: function (hostname, port, path, headers, body, isSecure, callback) {
        postRequest(hostname, port, path, headers, body,isSecure, callback);
    },
    downloadFileFromUrl : function(url , callback){
        var downloadDir = require("./appConstants").PATHS.DOWNLOAD_DIR;
        var extension = path.extname(url).split("?")[0];
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
                var key = new Date().getTime()+extension;
                var filePath = path.join(downloadDir,key);
                fs.writeFile(filePath , imagedata, 'binary')
                var file = {path :  filePath.substring(filePath.lastIndexOf("?")) , extension : extension , name : key}
                callback(file)
            })
        })
    },
    getSecure: function (url, callback) {
        https.get(url, function (res) {
            _getResp(res, callback)
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        }).end();
    }
}

function _isHttps(url){
    if(url.indexOf("https")!= -1){
        return true;
    }
    return false;
}

function _getResp(res, callback) {
    var fullResp = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        fullResp += chunk.toString();
    }).on('end', function () {
        callback(fullResp);
    });
}

function postRequest(hostname, port, path, headers, body, isSecure, callback) {
    var options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
    };
    var client = null;
    if (isSecure) {
        client = https;
    } else {
        client = http;
    }
    var req = client.request(options, function (res) {
        var fullResp = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            fullResp += chunk.toString();
        }).on('end', function () {
            callback(fullResp);
        });
    });
    req.on('error', function (e) {
        //logger.ERROR({request: options, body: body, error: e.message}, TAG)
    });
    req.write(body);
    req.end();
}