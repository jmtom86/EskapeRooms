var users= require('./../server/controllers/controller.js');


module.exports = function(app) {

    app.post('/login', function(req, res){
        console.log('sr', req.body)
        users.login(req, res);
    })
}
