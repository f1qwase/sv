var orm = require("orm")
var fs = require("fs")
var cnf = JSON.parse(fs.readFileSync("dbconf.json"))
var DbStr = "mysql://" + cnf.lgn + ":" + cnf.ass + "@" + cnf.hst + "/" + cnf.dbn;

var express = require('express')
	, routes = require('./routes')
	, api  = require('./routes/api')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, cons = require('consolidate')
	, url  = require('url');

var app = express()

console.log("DataBase config: " + DbStr );

// all environments
app.set( 'views', __dirname + '/public/views' );
app.set( 'port', process.env.PORT || 8000 );
app.engine( 'html', cons.mustache );
app.set( 'view engine', 'html' );
app.use( express.favicon() ); // TODO посмотреть
app.use( express.logger('dev') );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
//app.use(express.cookieParser(...));
//app.use(express.session(...));
app.use( express.static('public') );
// app.use("/css/", express.static(path.join(__dirname, 'public/stylesheets')))
// app.use("/js/", express.static(path.join(__dirname, 'public/javascripts')))
// app.use("/views/", express.static(path.join(__dirname, 'public/views')))
app.use(orm.express( DbStr, {
	define: function (db, models) 
	{
		clientFields = ["id", "academicYear", "semester", "subject", "type", "filename", "uploader", "description", "uploadDate", "link"],
		models.file = db.define("file", 
		{
			filename	: String,
			description	: String,
			link		: String,
			uploader	: String,
			isdel		: Boolean,
			uploadDate	: Date,
			ddate		: Date 
	    	},
		{
			methods: 
			{
		    		fullData: function ()
				{
			            	return this.filename + ' ' + this.description;
	        		},
				ToClientModel: function()
				{
					var SR = this;
			        	var result = {}
			        	clientFields.forEach(function(field)
					{
            					result[field] = ( SR[field]!=null ) ? SR[field].val || SR[field] : null;
			        	});
        				return result;
				}
	        	} 
	    	});

		models.type = db.define("type", /* Классификатор типов файлов (лекции, лабораторки, дз и т.д. */
		{
			val	: String,
	    	});
		models.academicYear = db.define("academicYear", /* Классификатор курсов (первый, второй, третий, четвертый, ... */
		{
			val	: String,
	    	});
		models.semester = db.define("semester", /* Классификатор семестров  (первый, второй) */
		{
			val	: String,
	    	});
		models.subject = db.define("subject", /* классификатор предметов */
		{
			val	: String,
	    	});

		models.file.hasOne("type", models.type, { required: true,  autoFetch : true});
		models.file.hasOne("academicYear", models.academicYear, { required: true,  autoFetch : true });
		models.file.hasOne("semester", models.semester, { required: true,  autoFetch : true });
		models.file.hasOne("subject", models.subject, { required: true,  autoFetch : true });

 		db.sync();
	}
}));

app.use( app.router );

app.get('/filterdata', api.structdatai)
app.get( '/files', api.files );
app.get( '/', routes.index );
app.post('/filterdata', api.structdata);

/* SERVER START */
app.listen(app.get('port'), function() {console.log("Listening on " + app.get('port'))});
