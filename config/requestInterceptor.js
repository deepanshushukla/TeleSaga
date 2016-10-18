/**
 * Created by anil on 4/7/15.
 */
var app = require('../app');

/**
 * Interceptor
 */
app.use(function(req, res, next){
    next();
});
