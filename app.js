// var orm = require("orm")
var fs = require("fs")
// var config = JSON.parse(fs.readFileSync("config.json"))

// console.log("mysql://" + config.dbUser + ":" + config.dbPassword + "@" + config.dbHost + "/" + config.dbDatabase)

// app.use(orm.express("mysql://" + config.dbUser + ":" + config.dbPassword + "@" + config.dbHost + "/" + config.dbDatabase, {
//     define: function (db, models) {
//         models.file = db.define("file", {
//         	name: String,
// 			url: String,
// 			subject: String,
// 			semester: Number,
// 			type: ["лекции", "задание", "готовая работа", "вопросы", "другое"],
// 			date: Number
//         });
//     }
// }));


var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate')

var app = express()
 
// all environments
app.set('views', __dirname + '/public/views');
app.set('port', process.env.PORT || 3000)
app.engine('html', cons.mustache);
app.set('view engine', 'html')
app.use(express.favicon()) // TODO посмотреть
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static('public'))
// app.use("/css/", express.static(path.join(__dirname, 'public/stylesheets')))
// app.use("/js/", express.static(path.join(__dirname, 'public/javascripts')))
// app.use("/views/", express.static(path.join(__dirname, 'public/views')))

app.get('/', routes.index)

app.get('/files', function(req, res) {
	// file.create([
	//     {
	//         name: "рарар",
	//         url: "http://google.com",
	//         semester: 3,
	//         type: "лекции"
	//     }], function (e, items) {
	//     	console.log(e)
	// });
    res.send('hello world')
})

app.listen(app.get('port'), function() {
  	console.log("Listening on " + app.get('port'))
});