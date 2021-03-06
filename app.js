﻿var orm = require("orm")
var fs = require("fs")
var cnf = JSON.parse(fs.readFileSync(__dirname + "/dbconf.json"))
var DbStr = "mysql://" + cnf.lgn + ":" + cnf.ass + "@" + cnf.hst + "/" + cnf.dbn;

var express = require('express')
	, routes = require('./routes')
	, api  = require('./routes/api')
	, http = require('http')
	, path = require('path')
	, cons = require('consolidate')
	, url  = require('url')
	, fileupload = require('fileupload').createFileUpload( __dirname + '/public/tupl/' ).middleware;

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
app.use( express.static(__dirname + '/public') );
// app.use("/css/", express.static(  __dirname + '/public/css/' ))
// app.use("/js/", express.static(  __dirname + '/public/js/' ))
// app.use("/", express.static(__dirname + '/public/' ))
app.use(orm.express( DbStr, {
	define: function (db, models) 
	{
		db.settings.set('connection.reconnect', 'auto-reconnect');
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

app.post( '/files', fileupload, api.fupl );

app.get('/filterdata', api.structdatai)
app.get( '/files', api.files );
app.get( '/structure/:id?', api.struct );
app.get( '/', routes.index );
app.post('/filterdata', api.structdata);
app.post('/fupl', api.fupl);
app.get('/templates', api.templates);
app.delete('/files/:id?', api.fdel );

/* SERVER START */
app.listen(app.get('port'), function() {console.log("Listening on " + app.get('port'))});
