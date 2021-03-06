var Filters = [ "academicYear", "semester", "subject", "type"];
var async = require('async');
var fs = require('fs');
var path = require('path')
var dateFormat = require('dateformat');

exports.fupl = function(req, res) {
	var YandexDisk = require('yandex-disk').YandexDisk;
	var disk = new YandexDisk('2ce613dbca6d4621a1a0750ea095c6bf');
	Out = {};
	Out['uploader'] = 'Гость';
	Out['uploadDate'] = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	Out['isdel'] = 0;
	async.forEachSeries(Filters, function( flt, callback ) 
	{
		(req.body[flt] == null)? res.send(400, "Form not true filled") /* console.log('xxx') callback()  вываливаемся в 6 */:  req.models[flt].find( { val : req.body[flt].toString().split(",") } , function (err, t_r ) 
		{
			Out[flt + '_id'] = t_r[0].id;
			callback();
		})
	},function( err ){
		Out["filename"] = req.body['filename'];
		Out["description"] = req.body['description'];
		var YdFName = Date.now() + req.body.file[0].basename;
		var uplfp = require('path').dirname(require.main.filename) +'/public/tupl/' + req.body.file[0].path;
		var uplfpath = uplfp + req.body.file[0].basename;
		disk.uploadFile( uplfpath, YdFName, function(err) {
			if (err)
				res.send(400, "Error adding file - upload");
			disk.exists(YdFName, function(err, exists) {
				(!exists)? res.send( err ):disk.publish(YdFName, function(err, link ) {
					if (err)
						res.send(400, "Error adding file - publish");
					disk.isPublic(YdFName, function(err, link) {
						fs.unlink(uplfpath, function (err) { if ( !err) {fs.rmdirSync(uplfp);} });
						Out['link'] = link;
						req.models.file.create([Out], function (err, items) {
							res.send(400, "DB write err");
						})
						res.send( 200, "" );
					});
				});
			});
		});
	})
//disk.cd('/');пока нету;disk.readFile('dxwebsetup.exe', 'binary', function(err, c) {res.setHeader('Content-disposition', 'attachment; filename=dxwebsetup.exe');res.write(c, 'binary');res.end();});
}

exports.struct = function(req, res) {
	var params = (req.params.id == null)? Filters :(req.params.id).split(",");
	var Out = {};
	async.forEachSeries(params, function(klassificator, callback) 
	{ 
		(req.models[klassificator]==null)? res.send ( JSON.stringify(null) ):req.models[klassificator].find({  }, function (err, SearchRes)
		{
			Out[klassificator] = SearchRes.map(function(item) {return item.val})
			callback();
		});
    }, function(err){
		res.json( Out );
	});
}

exports.files = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var Q = {};
	async.forEachSeries(Filters, function( flt, callback ) 
	{
		(query[flt] == null)? callback() :  req.models[flt].find( { val : query[flt].toString().split(",") } , function (err, t_r ) 
		{
			Q[flt + '_id'] = t_r.map(function(item) {return item.id});
			callback();
		})
	}, function( err ){
		Q["isdel"] =  [ 0 ];
		req.models.file.find( Q , function (err, files) {
			if (( err )|| (!files))
			{
				res.send( null );
				return;
			}
			var ss = query['ss'];
			var resArr = files.map(function(item) {return item.ToClientModel()});
			if(ss)
			{
				var SRArr = [], isfind = 0;
				resArr.forEach( function( val )
				{
					Object.keys(val).forEach( function ( v ){
						if((val[v]) && (val[v].toString().toLowerCase().indexOf(ss.toLowerCase()) + 1)) 
							isfind++
					})
					if( isfind )
						SRArr.push( val )
					isfind = 0;
				})
				res.send( JSON.stringify(SRArr) );
			}
			res.send( JSON.stringify(resArr) );
		});
	});
}

exports.structdata = function(req, res){
	if (req.body.tval!=null)
	{
		req.models[req.body.bdname].create([
    		{
        		val: req.body.tval ,
	    	}], function (err, items) {
			//;
		});
	}
	res.sendfile( require('path').dirname(require.main.filename) +'/public/test.htm')
}
exports.structdatai = function(req, res) {
	res.sendfile( require('path').dirname(require.main.filename) +'/public/test.htm')
}

/*
 * GET all files from views folder
 */
exports.templates = function(req, res){
	var dir = path.dirname(require.main.filename) +'/views'
	fs.readdir(dir, function(err, files) {
		files.forEach(function(file) {
			res.write('<script type="text/template" id="' + path.basename(file, ".html") + '">\n')
			res.write(fs.readFileSync(dir + "/" + file))
			res.write('</script>\n')
		})
		res.end()
	})
}

/* delete file npm install dateformat */
exports.fdel = function(req, res){
	req.models.file.find( { 'id' : req.params.id } , 1, function (err, files) {
		files[0].isdel = 1;
		files[0].ddate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
		files[0].save(function (err) {
            res.send( err );
        });		
	})
}
