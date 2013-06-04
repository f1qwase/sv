var orm = require("orm")
var fs = require("fs")
var cnf = JSON.parse(fs.readFileSync("dbconf.json"))
var DbStr = "mysql://" + cnf.lgn + ":" + cnf.ass + "@" + cnf.hst + "/" + cnf.dbn;

var express = require('express')
	, routes = require('./routes')
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

/* сделать принималку POST запросов для заполнения таблиц type, kurs, semes, subj */
app.get('/filterdata', function(req, res) {
	res.sendfile("public/test.htm")
})
app.post('/filterdata', function(req, res){
	if (req.body.tval!=null)
	{
		req.models[req.body.bdname].create([
    		{
        		val: req.body.tval ,
	    	}], function (err, items) {
			//;
		});
	}
	res.sendfile("public/test.htm")
});


/* SERVER START */
app.listen(app.get('port'), function() {console.log("Listening on " + app.get('port'))});

/* INDEX */
app.get('/', function(req, res) {
	res.sendfile("public/index.htm")
	//res.render('index.htm', { title: 'SNAME' });
})


app.get('/files', function(req, res) {
	req.models.file.find({ /*name: "file1"*/ }, function (err, files) {
		console.log("Files found: %d", files.length);
		if (files.length>0)
		{
	        	console.log( 	"The 1st file is : %s", files[0].fullData() ) ;
			var clientArray = [];
			files.forEach(function(file)
			{
				clientArray.push(file.ToClientModel() );
			});
			jt = JSON.stringify(clientArray);
			res.send ( jt );

//	        files[0].subj = "0";
//	        files[0].save( function (err) { console.log( err ); } );
		}
	});



/*
req.models.file.create([
    {
        filename: "file1",
        description: "opisanie",
        academicYear_id : 1,
		semester_id: 1,
		subject_id: 1,
		type_id: 1		
    }], function (err, items) {
		console.log (err);
	}
);
*/

	//res.send('form worked ' );
});
