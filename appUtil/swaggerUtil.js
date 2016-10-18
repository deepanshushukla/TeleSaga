/**
 * Created by anil on 4/7/15.
 */
var sw = require("swagger-node-express");
var paramTypes = sw.paramTypes;
module.exports = {

    convertToSwagger : function(swagger, apis){
        for (var i in apis){
            switch(apis[i].method){
                case "GET" :
                    swagger.addGet(getSpecs(apis[i]));
                    break;
                case "POST" :
                    swagger.addPost(getSpecs(apis[i]));
                    break;
                case "PUT" :
                    swagger.addPut(getSpecs(apis[i]));
                    break;
                case "DELETE" :
                    swagger.addDelete(getSpecs(apis[i]));
                    break;
            }
        }
    }
}


function getSpecs(api){
    var retVal = {};
    var spec = {};
    if(api.desc){
        spec.summary= api.desc;
    }
    spec.nickname = api.nickname;
    spec.path = getPath(api.path);
    if(api.notes){
        spec.notes= api.notes;
    }
//       notes : "Returns a pet based on ID",
//       summary : "Find pet by ID",
    spec.method = api.method;
    if(api.params){
        spec.parameters = getParameters(api.params, api.paramType);
    }
//       responseMessages : [swe.invalid('id'), swe.notFound('pet')]
//       nickname : "getPetById",
    //    type : "Pet",
    spec.produces = ["application/json"];
    retVal.spec = spec;
    console.log(JSON.stringify(retVal));
    return retVal;
}

/**
 *  https://github.com/swagger-api/swagger-spec/blob/master/versions/1.2.md#524-parameter-object
 */
function getParameters(params, type){
//    parameters : [paramTypes.path("petId", "ID of pet that needs to be fetched", "string")],
    var retVal = [];
    for(var i in params){
        var _type = type;
        if(params[i].paramType){
            _type = params[i].paramType;
        }
        if(params[i].required === undefined){
            params[i].required = true;
        }
        switch(_type){
            case "query":
                retVal.push(paramTypes.query(params[i].name, params[i].desc, params[i].type , params[i].required ));
                break;
            case "path":
                retVal.push(paramTypes.path(params[i].name, params[i].desc, params[i].type ));
                break;
            case "body":
                retVal.push(paramTypes.body(params[i].name, params[i].desc, params[i].type , params[i].required ));
                break;
            case "form":
                retVal.push(paramTypes.form(params[i].name, params[i].desc, params[i].type , params[i].required ));
                break;
        }
    }
    return retVal;
}

/**
 * converts "/insert/:user/:number" to "/insert/{user}/{number}"
 * @param path
 * @returns {*}
 */
function getPath(path){
    var newPath = path;
    var params = newPath.match(/:[a-z1-9]+/gi);
    for(var i in params){
        var param = params[i];
        newPath = newPath.replace(param, param.replace(":", "{") + "}")
    }
    return newPath.replace("","");
}