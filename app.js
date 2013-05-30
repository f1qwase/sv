var orm = require("orm")
var fs = require("fs")

//var config = JSON.parse(fs.readFileSync("config.json"))
//console.log("mysql://" + config.dbUser + ":" + config.dbPassword + "@" + config.dbHost + "/" + config.dbDatabase)
//app.use(orm.express("mysql://" + config.dbUser + ":" + config.dbPassword + "@" + config.dbHost + "/" + config.dbDatabase, {
//	define: function (db, models) {
// 		models.file = db.define("file", {
//			name: String,
//			url: String,
//			subject: String,
//			semester: Number,
//			type: ["лекции", "задание", "готовая работа", "вопросы", "другое"],
//			date: Number
//		});
//	}
//}));


var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, cons = require('consolidate')
	, url  = require('url')  /* F */

var app = express()
 
// all environments
app.set( 'views', __dirname + '/public/views' );
app.set( 'port', process.env.PORT || 8080 )
app.engine( 'html', cons.mustache );
app.set( 'view engine', 'html' )
app.use( express.favicon() ) // TODO посмотреть
app.use( express.logger('dev') )
app.use( express.bodyParser() )
app.use( express.methodOverride() )
app.use( app.router )
//app.use(express.cookieParser(...));
//app.use(express.session(...));
app.use( express.static('public') )
// app.use("/css/", express.static(path.join(__dirname, 'public/stylesheets')))
// app.use("/js/", express.static(path.join(__dirname, 'public/javascripts')))
// app.use("/views/", express.static(path.join(__dirname, 'public/views')))


/* INDEX */
app.get('/', function(req, res) {
	res.sendfile("public/index.htm")
	//res.render('index.htm', { title: 'SNAME' });
})


/* FILES */
app.get('/files', function(req, res) {
	res.send('hello world')
//file.create([
//{
//         name: "рарар",
//         url: "http://google.com",
//         semester: 3,
//         type: "лекции"
//     }], function (e, items) {
//     	console.log(e)
// });
//    res.send('hello world')
})

/* POST REQUEST */
app.post('/', function(req, res){
	console.log(req.body.data);
	res.send('form worked ' + req.body.data);
});

/* PUT REQUEST */
app.put('/', function(req, res){
	req.setEncoding('utf8');
	res.on('data', function(chunk){ res.write(chunk); console.log('xxx'); })
	res.send(req.body);
});

/* DELETE REQUEST */
app.delete('/', function(req, res){
//	delete 
	res.send(req.query);
});


/* SERVER START */
app.listen(app.get('port'), function() {console.log("Listening on " + app.get('port'))});
