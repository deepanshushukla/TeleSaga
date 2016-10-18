/**
 * Created by anil on 4/7/15.
 */
var app = require("../app");
var appUtil = require('../appUtil/appUtil');

var channelController = require('../controller/channelController');
var showController = require('../controller/showController');
var userController = require('../controller/userController');
var appController = require('../controller/appController');
var cronController = require('../controller/cronController');

var apis = [];
apis = apis
    .concat(channelController.apis)
    .concat(showController.apis)
    .concat(userController.apis)
    .concat(appController.apis)
    .concat(cronController.apis);

var swagger = require("swagger-node-express").createNew(app);

appUtil.swaggerUtil.convertToSwagger(swagger, apis);

swagger.configureDeclaration("pet", {
    description : "Operations about Pets",
    authorizations : ["oauth2"],
    produces: ["application/json"]
});

// set api info
swagger.setApiInfo({
    title: "APIs",
    description: "API documentations for avid",
    termsOfServiceUrl: "http://helloreverb.com/terms/",
    contact: "apiteam@wordnik.com",
    license: "Apache 2.0",
    licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure(appUtil.appConstants.env.APP_BASE_URL, "1.0.0");
app.get("/get/apis", function(req, res){
    res.send(JSON.stringify(apis));
});